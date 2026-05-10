import ApiService from './ApiService'

export async function apiGetChats<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/chats',
        method: 'get',
    })
}

export async function apiCreateChat<T>(data: { contactId: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/chats',
        method: 'post',
        data,
    })
}

export async function apiGetConversation<T>({ id }: { id: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/conversation/${id}`,
        method: 'get',
    })
}

export async function apiSendMessage<T>({ id, text }: { id: string; text: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/conversation/${id}/message`,
        method: 'post',
        data: { text, sender: 'me' },
    })
}

export async function apiGetContacts<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: `/contacts`,
        method: 'get',
    })
}

export async function apiGetContactDetails<T>({ id }: { id: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/contacts/${id}`,
        method: 'get',
    })
}
