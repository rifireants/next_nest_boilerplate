import { useEffect } from 'react'
import { io } from 'socket.io-client'

export function useTransactionSocket(onUpdate: () => void) {
  useEffect(() => {
    const socket = io('http://localhost:4000')

    socket.on('connect', () => {
      console.log('[socket] connected (admin)')
    })

    socket.on('transactions:update', () => {
      console.log('[socket] transactions:update')
      onUpdate()
    })

    return () => socket.disconnect()
  }, [])
}
