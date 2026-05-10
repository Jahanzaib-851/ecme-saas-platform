import { useEffect, useRef, useCallback } from 'react'
import dayjs from 'dayjs'
import SocketService from '@/services/SocketService'
import type { Message } from '../types'

const PLACEHOLDER_AVATAR = '/img/avatars/thumb-1.jpg'

type RawMessage = {
    id: string
    sender: { id: string; name: string; avatarImageUrl: string }
    content: string
    timestamp: number
    type: 'regular' | 'reply' | 'deleted' | 'divider'
    isMyMessage: boolean
    showAvatar?: boolean
}

type UseChatSocketOptions = {
    chatId: string | undefined
    senderName: string
    onMessage: (message: Message) => void
    onTypingChange: (name: string | null) => void
}

function useChatSocket({
    chatId,
    senderName,
    onMessage,
    onTypingChange,
}: UseChatSocketOptions) {
    const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const stopTypingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Join / leave chat room when selected chat changes
    useEffect(() => {
        if (!chatId) return
        const socket = SocketService.getSocket()
        if (!socket) return

        socket.emit('join_chat', chatId)
        return () => {
            socket.emit('leave_chat', chatId)
        }
    }, [chatId])

    // Listen for incoming messages
    useEffect(() => {
        if (!chatId) return
        const socket = SocketService.getSocket()
        if (!socket) return

        const onNewMessage = ({
            chatId: incomingId,
            message,
        }: {
            chatId: string
            message: RawMessage
        }) => {
            if (incomingId !== chatId) return
            // Skip own messages — already added optimistically
            if (message.isMyMessage) return

            const mapped: Message = {
                id: message.id,
                sender: {
                    id: message.sender.id,
                    name: message.sender.name,
                    avatarImageUrl: message.sender.avatarImageUrl ?? PLACEHOLDER_AVATAR,
                },
                content: message.content,
                timestamp: dayjs.unix(message.timestamp).toDate(),
                type: message.type ?? 'regular',
                isMyMessage: false,
                showAvatar: true,
            }
            onMessage(mapped)
        }

        socket.on('new_message', onNewMessage)
        return () => {
            socket.off('new_message', onNewMessage)
        }
    }, [chatId, onMessage])

    // Listen for typing indicators from other users
    useEffect(() => {
        if (!chatId) return
        const socket = SocketService.getSocket()
        if (!socket) return

        const onTyping = ({ sender }: { sender: string; chatId: string }) => {
            onTypingChange(sender)
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
            // Auto-clear after 3 s if stop_typing never fires
            typingTimerRef.current = setTimeout(() => onTypingChange(null), 3000)
        }

        const onStopTyping = () => {
            onTypingChange(null)
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
        }

        socket.on('typing', onTyping)
        socket.on('stop_typing', onStopTyping)
        return () => {
            socket.off('typing', onTyping)
            socket.off('stop_typing', onStopTyping)
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
        }
    }, [chatId, onTypingChange])

    // Emit typing — debounced stop after 2 s of silence
    const emitTyping = useCallback(() => {
        if (!chatId) return
        const socket = SocketService.getSocket()
        if (!socket) return

        socket.emit('typing', { chatId, sender: senderName })

        if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current)
        stopTypingTimerRef.current = setTimeout(() => {
            socket.emit('stop_typing', { chatId, sender: senderName })
        }, 2000)
    }, [chatId, senderName])

    // Emit stop typing immediately (called on message send)
    const emitStopTyping = useCallback(() => {
        if (!chatId) return
        const socket = SocketService.getSocket()
        if (!socket) return

        if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current)
        socket.emit('stop_typing', { chatId, sender: senderName })
    }, [chatId, senderName])

    return { emitTyping, emitStopTyping }
}

export default useChatSocket