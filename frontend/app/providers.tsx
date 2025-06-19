"use client"

import { useEffect } from "react"
import { useAuth } from "@/store/useAuth"
import socket from "@/lib/socket"

export function Providers({ children }: { children: React.ReactNode }) {
  const { email } = useAuth()

  useEffect(() => {
    // 로그인된 경우에만 연결
    if (email && !socket.connected) {
      socket.io.opts.query = { email }
      socket.connect()
      console.log("[socket] 연결됨:", email)
    }

    // cleanup 함수에서 연결 해제
    return () => {
      if (socket.connected) {
        socket.disconnect()
        console.log("[socket] 연결 해제됨")
      }
    }
  }, [email])

  return <>{children}</>
}