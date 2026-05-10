import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import ChatBox from '@/components/view/ChatBox'
import ChatAction from './ChatAction'
import StartConverstation from '@/assets/svg/StartConverstation'
import { useChatStore } from '../store/chatStore'
import { useSessionUser } from '@/store/authStore'
import { apiGetConversation, apiSendMessage } from '@/services/ChatService'
import useChatSocket from '../hooks/useChatSocket'
import classNames from '@/utils/classNames'
import useResponsive from '@/utils/hooks/useResponsive'
import dayjs from 'dayjs'
import uniqueId from 'lodash/uniqueId'
import { TbChevronLeft } from 'react-icons/tb'
import type { GetConversationResponse, Message, ChatType } from '../types'
import type { ScrollBarRef } from '@/components/view/ChatBox'

const PLACEHOLDER_AVATAR = '/img/avatars/thumb-1.jpg'

function getFileType(file: File): 'image' | 'video' | 'audio' | 'misc' {
    if (/^image\//.test(file.type)) return 'image'
    if (/^video\//.test(file.type)) return 'video'
    if (/^audio\//.test(file.type)) return 'audio'
    return 'misc'
}

// ─── ChatHeader (memoized to prevent re-renders on conversation change) ────────

const ChatHeader = memo(
    ({
        selectedChat,
        onProfileClick,
        onBack,
        showBack,
    }: {
        selectedChat: { user?: { name: string; avatarImageUrl: string }; chatType?: ChatType; muted?: boolean }
        onProfileClick: () => void
        onBack: () => void
        showBack: boolean
    }) => (
        <div className="flex items-center gap-2">
            {showBack && (
                <button
                    className="text-xl hover:text-primary"
                    aria-label="Back to chat list"
                    onClick={onBack}
                >
                    <TbChevronLeft />
                </button>
            )}
            <button
                className="flex items-center gap-2"
                role="button"
                aria-label={`View ${selectedChat.user?.name ?? 'contact'} profile`}
                onClick={onProfileClick}
            >
                <Avatar src={selectedChat.user?.avatarImageUrl} />
                <div className="min-w-0 flex-1 text-left">
                    <div className="font-bold heading-text truncate">
                        {selectedChat.user?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                        {selectedChat.chatType === 'groups'
                            ? 'Click for group info'
                            : 'Last seen recently'}
                    </div>
                </div>
            </button>
        </div>
    )
)
ChatHeader.displayName = 'ChatHeader'

// ─── ChatBody ─────────────────────────────────────────────────────────────────

const ChatBody = () => {
    const scrollRef = useRef<ScrollBarRef>(null)

    const selectedChat = useChatStore((state) => state.selectedChat)
    const conversationRecord = useChatStore((state) => state.conversationRecord)
    const pushConversationRecord = useChatStore((state) => state.pushConversationRecord)
    const setSelectedChat = useChatStore((state) => state.setSelectedChat)
    const pushConversationMessage = useChatStore((state) => state.pushConversationMessage)
    const setContactInfoDrawer = useChatStore((state) => state.setContactInfoDrawer)

    const userName = useSessionUser((state) => state.user.userName) ?? 'You'

    const [conversation, setConversation] = useState<Message[]>([])
    const [typingUser, setTypingUser] = useState<string | null>(null)

    const { smaller } = useResponsive()

    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [])

    const handleIncomingMessage = useCallback(
        (message: Message) => {
            if (!selectedChat.id) return
            pushConversationMessage(selectedChat.id, message)
            setConversation((prev) => [...prev, message])
            setTimeout(scrollToBottom, 50)
        },
        // selectedChat.id and pushConversationMessage are stable enough here
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedChat.id, scrollToBottom],
    )

    const handleTypingChange = useCallback((name: string | null) => {
        setTypingUser(name)
    }, [])

    const { emitTyping, emitStopTyping } = useChatSocket({
        chatId: selectedChat.id,
        senderName: userName,
        onMessage: handleIncomingMessage,
        onTypingChange: handleTypingChange,
    })

    const handleProfileClick = useCallback(() => {
        setContactInfoDrawer({
            userId: selectedChat.user?.id ?? '',
            chatId: selectedChat.id ?? '',
            chatType: (selectedChat.chatType ?? '') as ChatType,
            open: true,
        })
    }, [selectedChat, setContactInfoDrawer])

    // Fetch conversation only when selectedChat.id changes — not on every render
    useEffect(() => {
        if (!selectedChat.id) return

        setConversation([])

        const cached = conversationRecord.find((r) => r.id === selectedChat.id)

        if (cached) {
            setConversation(cached.conversation)
            setTimeout(scrollToBottom, 50)
            return
        }

        apiGetConversation<GetConversationResponse>({ id: selectedChat.id })
            .then((resp) => {
                setConversation(resp.conversation)
                pushConversationRecord(resp)
                setTimeout(scrollToBottom, 50)
            })
            .catch(() => {
                setConversation([])
            })
    // conversationRecord and pushConversationRecord are stable Zustand refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat.id])

    const handleInputChange = useCallback(
        async ({ value, attachments }: { value: string; attachments?: File[] }) => {
            if (!value.trim() && !attachments?.length) return
            if (!selectedChat.id) return

            emitStopTyping()

            // Optimistic update — message appears instantly
            const optimistic: Message = {
                id: uniqueId('msg-'),
                sender: { id: 'me', name: 'You', avatarImageUrl: PLACEHOLDER_AVATAR },
                content: value,
                attachments: attachments?.map((f) => ({
                    type: getFileType(f),
                    source: f,
                    mediaUrl: URL.createObjectURL(f),
                })),
                timestamp: dayjs().toDate(),
                type: 'regular',
                isMyMessage: true,
            }

            pushConversationMessage(selectedChat.id, optimistic)
            setConversation((prev) => [...prev, optimistic])
            scrollToBottom()

            // Persist to backend — UI already updated so failure is silent
            if (value.trim()) {
                try {
                    await apiSendMessage({ id: selectedChat.id, text: value })
                } catch {
                    // Could show a "failed to send" indicator here
                }
            }
        },
        [selectedChat.id, pushConversationMessage, scrollToBottom, emitStopTyping],
    )

    const messageList = useMemo(
        () =>
            conversation.map((item) => ({
                ...item,
                timestamp:
                    typeof item.timestamp === 'number'
                        ? dayjs.unix(item.timestamp).toDate()
                        : item.timestamp,
                showAvatar: item.isMyMessage ? false : item.showAvatar,
            })),
        [conversation]
    )

    const cardHeaderProps = useMemo(
        () => ({
            header: {
                content: (
                    <ChatHeader
                        selectedChat={selectedChat}
                        onProfileClick={handleProfileClick}
                        onBack={() => setSelectedChat({})}
                        showBack={smaller.md}
                    />
                ),
                extra: <ChatAction muted={selectedChat.muted} />,
                className: 'bg-gray-100 dark:bg-gray-600 h-[100px]',
            },
        }),
        [selectedChat, handleProfileClick, smaller.md, setSelectedChat]
    )

    if (!selectedChat.id) {
        return (
            <div
                className="flex-1 h-full max-h-full flex flex-col items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-800"
                role="main"
                aria-label="Select a conversation to start chatting"
            >
                <StartConverstation height={250} width={250} />
                <div className="mt-10 text-center">
                    <h3>Start Chatting</h3>
                    <p className="mt-2 text-base text-gray-500">
                        Pick a conversation or begin a new one
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full md:block" role="main" aria-label="Chat conversation">
            <Card
                className="flex-1 h-full max-h-full dark:border-gray-700"
                bodyClass="h-[calc(100%-100px)] relative"
                {...cardHeaderProps}
            >
                <ChatBox
                    ref={scrollRef}
                    messageList={messageList}
                    placeholder="Type a message..."
                    showAvatar
                    avatarGap
                    messageListClass="h-[calc(100%-100px)]"
                    bubbleClass="max-w-[300px]"
                    onInputChange={handleInputChange}
                    onTyping={emitTyping}
                    typing={
                        typingUser
                            ? {
                                  id: 'typing-indicator',
                                  name: typingUser,
                                  avatarImageUrl:
                                      selectedChat.user?.avatarImageUrl ??
                                      PLACEHOLDER_AVATAR,
                              }
                            : false
                    }
                />
            </Card>
        </div>
    )
}

export default memo(ChatBody)
