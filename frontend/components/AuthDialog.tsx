"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/store/useAuth'

export function AuthDialog() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { login } = useAuth()

  const handleSubmit = async () => {
    const payload = { email, password }
    const endpoint = isLogin ? "/auth/login" : "/auth/register"

    try {
      const res = await fetch(`http://localhost:4000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "에러 발생")
      }

      if (isLogin) {
        login(data.access_token, data.email, data.isAdmin)
      }

      alert(`${isLogin ? "로그인" : "회원가입"} 성공: ${data.email}`)
    } catch (err: any) {
      alert(`에러: ${err.message}`)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{isLogin ? "로그인" : "회원가입"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{isLogin ? "로그인" : "회원가입"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit}>{isLogin ? "로그인" : "회원가입"}</Button>
          <p className="text-sm text-center text-gray-500">
            {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
            <button
              className="ml-2 text-blue-600 underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "회원가입" : "로그인"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
