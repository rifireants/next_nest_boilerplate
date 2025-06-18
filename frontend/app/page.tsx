"use client"

import { useEffect, useState } from "react"
import { AuthDialog } from "@/components/AuthDialog"
import { useAuth } from "@/store/useAuth"
import { useSocket } from '@/store/useSocket'
import { useMyTransactionSocket } from '@/store/useMyTransactionSocket'

export default function Home() {
  const { token, email, logout } = useAuth()
  const [userInfo, setUserInfo] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit")
  const [amount, setAmount] = useState(0)
  const [message, setMessage] = useState("")
  const [points, setPoints] = useState<number>(0)
  const [myTxs, setMyTxs] = useState<any[]>([])
  const [pointLogs, setPointLogs] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !token) return

    fetchMyTransactions();

    fetch("http://localhost:4000/auth/points", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPoints(data.points))

    fetch("http://localhost:4000/auth/pointlogs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPointLogs(data))
    // const fetchUser = async () => {
    //   const res = await fetch("http://localhost:4000/auth/me", {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   const data = await res.json()
    //   setUserInfo(data)
    // }

    // fetchUser()
  }, [mounted, token])

  const fetchMyTransactions = async () => {
    fetch("http://localhost:4000/transactions/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMyTxs(data))
  }

  useMyTransactionSocket(email, fetchMyTransactions)
  useSocket(email, (newPoints) => {
    setPoints(newPoints)
  })

  const handleRequest = async () => {
    if (amount <= 0) return alert("금액을 입력하세요.")
    const res = await fetch("http://localhost:4000/transactions/request", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, type, amount }),
    })
    const data = await res.json()
    if (res.ok) {
      setMessage("요청 완료! 관리자 승인을 기다려주세요.")
      setAmount(0)
    } else {
      alert(data.message || "요청 실패")
    }
  }

  if (!mounted) return null // ✅ SSR 시 아무것도 렌더링하지 않음

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-6 p-6">
      <AuthDialog />
      {token && (
        <>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-green-600">로그인됨: {email}</p>
            <p className="text-sm">
              보유 포인트:{" "}
              <span className="font-bold">
                {typeof points === 'number' ? points.toLocaleString() : '로딩 중...'}
              </span>
            </p>
            <button onClick={logout} className="text-red-500 underline">로그아웃</button>
          </div>

          <div className="border p-4 rounded w-full max-w-sm bg-white shadow">
            <h2 className="text-lg font-semibold mb-2 text-center">입/출금 요청</h2>
            <div className="space-y-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "deposit" | "withdrawal")}
                className="w-full border px-2 py-1 rounded"
              >
                <option value="deposit">입금</option>
                <option value="withdrawal">출금</option>
              </select>
              <input
                type="number"
                value={isNaN(amount) ? '' : amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                placeholder="금액 입력"
                className="w-full border px-2 py-1 rounded"
              />
              <button
                onClick={handleRequest}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                요청하기
              </button>
              {message && <p className="text-center text-green-600 text-sm mt-2">{message}</p>}
            </div>
          </div>

          {myTxs.length > 0 && (
            <div className="w-full max-w-md mt-8 bg-white border rounded shadow p-4">
              <h3 className="text-md font-semibold mb-2 text-center">내 요청 내역</h3>
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">유형</th>
                    <th className="border px-2 py-1">금액</th>
                    <th className="border px-2 py-1">상태</th>
                    <th className="border px-2 py-1">시간</th>
                  </tr>
                </thead>
                <tbody>
                  {myTxs.map((tx) => (
                    <tr key={tx.id} className="text-center">
                      <td className="border px-2 py-1">{tx.type === "deposit" ? "입금" : "출금"}</td>
                      <td className="border px-2 py-1">{tx.amount.toLocaleString()}원</td>
                      <td className="border px-2 py-1">
                        {tx.status === "pending" && "⏳ 대기"}
                        {tx.status === "approved" && "✅ 승인"}
                        {tx.status === "rejected" && "❌ 거절"}
                      </td>
                      <td className="border px-2 py-1">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pointLogs.length > 0 && (
            <div className="w-full max-w-md mt-10 bg-white border rounded shadow p-4">
              <h3 className="text-md font-semibold mb-2 text-center">포인트 변경 내역</h3>
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">변경</th>
                    <th className="border px-2 py-1">사유</th>
                    <th className="border px-2 py-1">잔액</th>
                    <th className="border px-2 py-1">시간</th>
                  </tr>
                </thead>
                <tbody>
                  {pointLogs.map((log) => (
                    <tr key={log.id} className="text-center">
                      <td className="border px-2 py-1">{log.change > 0 ? `+${log.change}` : log.change}</td>
                      <td className="border px-2 py-1">{log.reason}</td>
                      <td className="border px-2 py-1">{log.after.toLocaleString()}P</td>
                      <td className="border px-2 py-1">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </>
      )}
    </main>
  )
}
