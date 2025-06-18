import { io, Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'

export function useSocket(email: string | null, onPointUpdate: (points: number) => void) {
  useEffect(() => {
    if (!email) return

    const socket: Socket = io('http://localhost:4000', {
      query: { email },
    })

    socket.on('connect', () => {
      console.log('[socket] connected')
    })

    socket.on('point:update', (data) => {
      console.log('[socket] point:update', data)
      if (data.email === email) {
        onPointUpdate(data.newPoints)
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [email])
}
