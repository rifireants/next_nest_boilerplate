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
export class PointsGateway {
  @WebSocketServer()
  server: Server

  // 특정 유저에게 포인트 갱신 이벤트 전송
  notifyPointUpdate(email: string, newPoints: number) {
    this.server.to(email).emit('point:update', { email, newPoints })
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
