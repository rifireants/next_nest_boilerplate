// ✅ 로그인/회원가입 다이얼로그 (shadcn + react-hook-form + zod)

"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/store/useAuth"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AuthDialog() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmError, setConfirmError] = useState("")
  const [emailExists, setEmailExists] = useState<boolean | null>(null)
  const { login, open, openDialog } = useAuth()
  const router = useRouter()

  const [debouncedEmail] = useDebounce(email, 500)
  const [debouncedPassword] = useDebounce(password, 500)
  const [debouncedConfirm] = useDebounce(confirm, 500)

  useEffect(() => {
    if (!debouncedEmail) return setEmailError("")
    if (!emailRegex.test(debouncedEmail)) {
      setEmailError("이메일 형식이 올바르지 않습니다.")
      return
    }
    setEmailError("")
  }, [debouncedEmail])

  useEffect(() => {
    if (isLogin || emailError || !debouncedEmail) return setEmailExists(null)

    const check = async () => {
      const res = await fetch(`http://localhost:4000/auth/check-email?email=${debouncedEmail}`)
      const data = await res.json()
      setEmailExists(data.exists)
    }
    check()
  }, [debouncedEmail, emailError, isLogin])

  useEffect(() => {
    if (!debouncedPassword) return setPasswordError("")
    if (debouncedPassword.length < 6) {
      setPasswordError("비밀번호는 최소 6자 이상이어야 합니다.")
    } else {
      setPasswordError("")
    }
  }, [debouncedPassword])

  useEffect(() => {
    if (!isLogin && debouncedConfirm) {
      if (debouncedPassword !== debouncedConfirm) {
        setConfirmError("비밀번호가 일치하지 않습니다.")
      } else {
        setConfirmError("")
      }
    } else {
      setConfirmError("")
    }
  }, [debouncedConfirm, debouncedPassword, isLogin])

  const handleSubmit = async () => {
    if (!email || emailError || passwordError || confirmError || (!isLogin && emailExists)) return

    const payload: any = { email, password }
    const endpoint = isLogin ? "/auth/login" : "/auth/register"

    try {
      const res = await fetch(`http://localhost:4000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "에러 발생")

      openDialog(false)

      if (isLogin) {
        login(data.access_token, data.email, data.isAdmin)
        router.push(data.isAdmin ? "/admin" : "/")
      } else {
        alert("회원가입 완료! 로그인해주세요.")
        setIsLogin(true)
      }
    } catch (err: any) {
      alert(`에러: ${err.message}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={openDialog}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            {!isLogin && email && !emailError && emailExists === false && (
              <p className="text-sm text-green-500">사용 가능한 이메일입니다.</p>
            )}
            {!isLogin && emailExists && (
              <p className="text-sm text-red-500">이미 사용 중인 이메일입니다.</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
          </div>
          {!isLogin && (
            <div className="grid gap-2">
              <Label htmlFor="confirm">비밀번호 확인</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              {confirmError && <p className="text-sm text-red-500">{confirmError}</p>}
            </div>
          )}
          <Button onClick={handleSubmit}>{isLogin ? "로그인" : "회원가입"}</Button>
          <p className="text-sm text-center text-gray-500">
            {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
            <button
              className="ml-2 text-blue-600 underline"
              onClick={() => {
                setIsLogin(!isLogin)
                setEmailError("")
                setPasswordError("")
                setConfirmError("")
                setEmailExists(null)
              }}
            >
              {isLogin ? "회원가입" : "로그인"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
