"use client"

import { useEffect, useState } from "react"
import { AuthDialog } from "@/components/AuthDialog"
import { useAuth } from "@/store/useAuth"

export default function Home() {
  const { token, email, logout } = useAuth()
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return
      const res = await fetch("http://localhost:4000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setUserInfo(data)
    }
    fetchUser()
  }, [token])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-6">
      <AuthDialog />
      {token && (
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-green-600">
            로그인됨: {email}
          </p>
          {userInfo && (
            <p className="text-sm text-gray-700">
              인증 API 응답: {JSON.stringify(userInfo)}
            </p>
          )}
          <button onClick={logout} className="text-red-600 underline">
            로그아웃
          </button>
        </div>
      )}
    </main>
  )
}
