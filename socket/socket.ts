
import { Server, Socket } from 'socket.io'


export function socket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('Socket connected:', socket.id)

        socket.on('hello', (data) => {
            console.log('Message:', data)
            socket.emit('helloBack', 'hello, hello')
        })

        // socket.on('newTweetAdded', (tweetId) => {

        // })
        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id)
        })
    })
}