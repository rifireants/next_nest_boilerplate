// src/hooks/useSocketEvents.ts
import { useEffect } from 'react'
import socket from '@/lib/socket'

type Handlers = {
  email?: string | null  // ✅ 선택적 email
  onPointUpdate?: (points: number) => void
  onMyTxUpdate?: () => void
  onAdminTxUpdate?: () => void
  onPointLogUpdate?: () => void
}

export function useSocketEvents({
  email,
  onPointUpdate,
  onMyTxUpdate,
  onAdminTxUpdate,
  onPointLogUpdate,
}: Handlers) {
  useEffect(() => {
    const log = (msg: string) => console.log(`[socket] ${msg}`)

    if (onPointUpdate && email) {
      socket.on('point:update', (data) => {
        log(`point:update ${JSON.stringify(data)}`)
        if (data.email === email) onPointUpdate(data.newPoints)
      })
    }

    if (onPointLogUpdate && email) {
      socket.on('pointlog:update', onPointLogUpdate)
    }

    if (onMyTxUpdate && email) {
      socket.on('transactions:me:update', () => {
        log('transactions:me:update')
        onMyTxUpdate()
      })
    }

    if (onAdminTxUpdate) {
      socket.on('transactions:update', () => {
        log('transactions:update')
        onAdminTxUpdate()
      })
    }

    return () => {
      socket.off('point:update')
      socket.off('transactions:me:update')
      socket.off('transactions:update')
      socket.off('pointlog:update')
    }
  }, [email, onPointUpdate, onMyTxUpdate, onAdminTxUpdate])
}
