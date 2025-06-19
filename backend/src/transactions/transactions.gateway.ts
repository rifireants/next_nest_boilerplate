import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TransactionsGateway {
  @WebSocketServer()
  server: Server

  broadcastUpdate() {
    // 관리자 클라이언트에게 전체 전송
    this.server.emit('transactions:update')
  }

  notifyUser(email: string) {
    this.server.to(email).emit('transactions:me:update')
    console.log(`[WS] transactions:me:update to ${email}`)
  }

  // 유저가 접속하면 이메일 기반 방에 입장시킴
  handleConnection(socket: any) {
    const email = socket.handshake.query.email
    if (email) {
      socket.join(email)
      console.log(`[socket] ${email} joined`)
    }
  }
}
