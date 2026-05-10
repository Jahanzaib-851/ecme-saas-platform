import { useEffect, useState, useMemo, useCallback } from 'react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import ScrollBar from '@/components/ui/ScrollBar'
import DebouceInput from '@/components/shared/DebouceInput'
import classNames from '@/utils/classNames'
import { apiGetContacts, apiCreateChat } from '@/services/ChatService'
import { useChatStore } from '../store/chatStore'
import { TbSearch, TbCheck, TbLoader2 } from 'react-icons/tb'
import useSWRMutation from 'swr/mutation'
import type { GetContactsResponse, UserDetails } from '../types'

async function getContacts() {
    return apiGetContacts<GetContactsResponse>()
}

const NewChat = () => {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<UserDetails | null>(null)
    const [query, setQuery] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    const setChats = useChatStore((state) => state.setChats)
    const chats = useChatStore((state) => state.chats)
    const setSelectedChat = useChatStore((state) => state.setSelectedChat)

    const { data, trigger: fetchContacts, isMutating } = useSWRMutation(
        '/contacts',
        getContacts
    )

    useEffect(() => {
        if (open) {
            fetchContacts()
            setSelected(null)
            setQuery('')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const contacts = useMemo(() => {
        if (!data) return []
        const q = query.toLowerCase()
        return q
            ? data.filter((c) => c.name.toLowerCase().includes(q))
            : data
    }, [data, query])

    const handleClose = useCallback(() => {
        setOpen(false)
        setSelected(null)
    }, [])

    const handleStartChat = useCallback(async () => {
        if (!selected) return
        setIsCreating(true)

        try {
            const chat = await apiCreateChat<any>({ contactId: selected.id })
            const newChat = chat?.data ?? chat

            // Add to store only if not already present
            const alreadyExists = chats.some((c) => c.id === newChat.id)
            if (!alreadyExists) {
                setChats([newChat, ...chats])
            }

            // Auto-open the new conversation
            setSelectedChat({
                id: newChat.id,
                user: {
                    id: newChat.userId,
                    name: newChat.name,
                    avatarImageUrl: newChat.avatar,
                },
                muted: false,
                chatType: 'personal',
            })

            handleClose()
        } catch {
            // Chat creation failed — keep dialog open
        } finally {
            setIsCreating(false)
        }
    }, [selected, chats, setChats, setSelectedChat, handleClose])

    return (
        <>
            <Button
                block
                variant="solid"
                aria-label="Start a new chat"
                onClick={() => setOpen(true)}
            >
                New Chat
            </Button>

            <Dialog
                isOpen={open}
                onClose={handleClose}
                onRequestClose={handleClose}
            >
                <div>
                    <div className="text-center mb-6">
                        <h4 className="mb-1">New Conversation</h4>
                        <p className="text-gray-500">Select a contact to message</p>
                    </div>

                    <DebouceInput
                        placeholder="Search contacts..."
                        type="text"
                        size="sm"
                        aria-label="Search contacts"
                        prefix={<TbSearch className="text-lg" />}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <div className="mt-4">
                        {isMutating ? (
                            <div className="flex justify-center py-8">
                                <TbLoader2 className="animate-spin text-2xl text-primary" aria-label="Loading contacts" />
                            </div>
                        ) : (
                            <>
                                <p className="font-semibold uppercase text-xs mb-4 text-gray-400">
                                    {contacts.length} contact{contacts.length !== 1 ? 's' : ''} available
                                </p>
                                <ScrollBar className="overflow-y-auto h-72 mb-6">
                                    <div className="pr-3 flex flex-col gap-2">
                                        {contacts.length === 0 ? (
                                            <p className="text-center py-8 text-gray-400">
                                                No contacts found
                                            </p>
                                        ) : (
                                            contacts.map((contact) => (
                                                <div
                                                    key={contact.id}
                                                    role="button"
                                                    tabIndex={0}
                                                    aria-label={`Select ${contact.name}`}
                                                    aria-pressed={selected?.id === contact.id}
                                                    className={classNames(
                                                        'py-3 px-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                                                        selected?.id === contact.id &&
                                                            'bg-gray-100 dark:bg-gray-700'
                                                    )}
                                                    onClick={() =>
                                                        setSelected((prev) =>
                                                            prev?.id === contact.id ? null : contact
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Avatar shape="circle" src={contact.img} />
                                                        <div>
                                                            <p className="heading-text font-semibold">
                                                                {contact.name}
                                                            </p>
                                                            <p className="text-sm text-gray-400">
                                                                {contact.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {selected?.id === contact.id && (
                                                        <TbCheck className="text-xl text-primary" aria-hidden />
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </ScrollBar>
                            </>
                        )}

                        <Button
                            block
                            variant="solid"
                            disabled={!selected || isCreating}
                            loading={isCreating}
                            aria-label="Open conversation with selected contact"
                            onClick={handleStartChat}
                        >
                            {isCreating ? 'Opening...' : selected ? `Message ${selected.name}` : 'Select a contact'}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default NewChat
