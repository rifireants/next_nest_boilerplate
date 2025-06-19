// src/lib/socket.ts
import { io } from 'socket.io-client'

const socket = io('http://localhost:4000', {
  autoConnect: false, // 필요할 때만 연결
})

export default socket
