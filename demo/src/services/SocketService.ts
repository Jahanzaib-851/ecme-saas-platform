import { io, Socket } from 'socket.io-client'

class SocketService {
    private socket: Socket | null = null

    connect(token: string) {
        if (this.socket?.connected) return

        // Dev: window.location.origin (Vite proxy routes /socket.io → localhost:5000)
        // Prod: VITE_SOCKET_URL points to the deployed backend
        const url =
            import.meta.env.VITE_SOCKET_URL || window.location.origin

        this.socket = io(url, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        })

        this.socket.on('connect', () => {
            console.log('[socket] connected:', this.socket?.id)
        })

        this.socket.on('disconnect', (reason) => {
            console.log('[socket] disconnected:', reason)
        })

        this.socket.on('connect_error', (err) => {
            console.warn('[socket] connection error:', err.message)
        })
    }

    disconnect() {
        this.socket?.disconnect()
        this.socket = null
    }

    getSocket(): Socket | null {
        return this.socket
    }
}

export default new SocketService()