import { useRef, useState, useEffect, memo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import ScrollBar from '@/components/ui/ScrollBar'
import ChatSegment from './ChatSegment'
import NewChat from './NewChat'
import { useChatStore } from '../store/chatStore'
import useChat from '../hooks/useChat'
import classNames from '@/utils/classNames'
import useDebounce from '@/utils/hooks/useDebounce'
import { TbVolumeOff, TbSearch, TbX, TbMessageCircle } from 'react-icons/tb'
import dayjs from 'dayjs'
import type { ChatType } from '../types'
import type { ChangeEvent } from 'react'

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const ChatSkeleton = () => (
    <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading chats">
        {Array.from({ length: 5 }).map((_, i) => (
            <div
                key={i}
                className="py-3 px-2 flex items-center gap-3 rounded-xl"
            >
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/2" />
                </div>
            </div>
        ))}
    </div>
)

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyChats = () => (
    <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
        <TbMessageCircle className="text-4xl text-gray-300 dark:text-gray-600" aria-hidden />
        <div>
            <p className="font-semibold heading-text">No conversations yet</p>
            <p className="text-sm text-gray-400 mt-1">
                Start a new chat using the button below
            </p>
        </div>
    </div>
)

// ─── ChatList ─────────────────────────────────────────────────────────────────

const ChatList = () => {
    const chats = useChatStore((state) => state.chats)
    const chatsFetched = useChatStore((state) => state.chatsFetched)
    const selectedChat = useChatStore((state) => state.selectedChat)
    const setSelectedChat = useChatStore((state) => state.setSelectedChat)
    const setMobileSidebar = useChatStore((state) => state.setMobileSidebar)
    const selectedChatType = useChatStore((state) => state.selectedChatType)
    const setSelectedChatType = useChatStore((state) => state.setSelectedChatType)
    const setChatRead = useChatStore((state) => state.setChatRead)

    const inputRef = useRef<HTMLInputElement>(null)
    const [showSearchBar, setShowSearchBar] = useState(false)
    const [queryText, setQueryText] = useState('')

    const { fetchChats, isChatsFetching } = useChat()

    useEffect(() => {
        if (!chatsFetched) {
            fetchChats()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (showSearchBar) {
            inputRef.current?.focus()
        }
    }, [showSearchBar])

    const handleChatClick = ({
        id,
        user,
        muted,
        chatType,
        unread,
    }: {
        id: string
        user: { id: string; avatarImageUrl: string; name: string }
        muted: boolean
        chatType: ChatType
        unread: number
    }) => {
        if (unread > 0) setChatRead(id)
        setSelectedChat({ id, user, muted, chatType })
        setMobileSidebar(false)
    }

    function handleDebounceFn(e: ChangeEvent<HTMLInputElement>) {
        const val = e.target.value
        setSelectedChatType(val.length > 0 ? '' : 'personal')
        setQueryText(val)
    }

    const debounceFn = useDebounce(handleDebounceFn, 300)

    const filteredChats = chats.filter((item) => {
        if (queryText) {
            return item.name.toLowerCase().includes(queryText.toLowerCase())
        }
        return selectedChatType === item.chatType
    })

    const isLoading = isChatsFetching && !chatsFetched

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                    {showSearchBar ? (
                        <input
                            ref={inputRef}
                            className="flex-1 h-full placeholder:text-gray-400 placeholder:text-base bg-transparent focus:outline-hidden heading-text font-bold"
                            placeholder="Search conversations..."
                            aria-label="Search conversations"
                            onChange={debounceFn}
                        />
                    ) : (
                        <h4>Chat</h4>
                    )}
                    <button
                        className="close-button text-lg"
                        type="button"
                        aria-label={showSearchBar ? 'Close search' : 'Search chats'}
                        onClick={() => setShowSearchBar((v) => !v)}
                    >
                        {showSearchBar ? <TbX /> : <TbSearch />}
                    </button>
                </div>
                <ChatSegment />
            </div>

            <ScrollBar className="h-[calc(100%-150px)] overflow-y-auto">
                {isLoading ? (
                    <ChatSkeleton />
                ) : filteredChats.length === 0 ? (
                    <EmptyChats />
                ) : (
                    <div className="flex flex-col gap-2">
                        {filteredChats.map((item) => (
                            <div
                                key={item.id}
                                role="button"
                                tabIndex={0}
                                aria-label={`Open conversation with ${item.name}`}
                                aria-current={selectedChat.id === item.id ? 'true' : undefined}
                                className={classNames(
                                    'py-3 px-2 flex items-center gap-2 justify-between rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer select-none transition-colors',
                                    selectedChat.id === item.id &&
                                        'bg-gray-100 dark:bg-gray-700'
                                )}
                                onClick={() =>
                                    handleChatClick({
                                        id: item.id,
                                        user: {
                                            id: item.userId || item.groupId,
                                            avatarImageUrl: item.avatar,
                                            name: item.name,
                                        },
                                        muted: item.muted,
                                        chatType: item.chatType,
                                        unread: item.unread,
                                    })
                                }
                            >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <Avatar src={item.avatar} />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex justify-between">
                                            <div className="font-bold heading-text truncate flex gap-2 items-center">
                                                <span>{item.name}</span>
                                                {item.muted && (
                                                    <TbVolumeOff
                                                        className="opacity-60"
                                                        aria-label="Muted"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="truncate text-sm text-gray-500">
                                            {item.lastConversation}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 items-center shrink-0">
                                    <small className="font-semibold text-gray-400">
                                        {/* item.time is Unix seconds from backend */}
                                        {dayjs.unix(item.time).format('hh:mm A')}
                                    </small>
                                    {item.unread > 0 && (
                                        <Badge
                                            className="bg-primary"
                                            aria-label={`${item.unread} unread messages`}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollBar>

            <NewChat />
        </div>
    )
}

export default memo(ChatList)
