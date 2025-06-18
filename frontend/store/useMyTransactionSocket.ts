import { useEffect } from 'react'
import { io } from 'socket.io-client'

export function useMyTransactionSocket(email: string | null, onUpdate: () => void) {
  useEffect(() => {
    if (!email) return

    const socket = io('http://localhost:4000', {
      query: { email },
    })

    socket.on('connect', () => {
      console.log('[socket] connected (user tx)')
    })

    socket.on('transactions:me:update', () => {
      console.log('[socket] received transactions:me:update')
      onUpdate()
    })

    return () => socket.disconnect()
  }, [email])
}
