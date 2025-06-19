"use client"

import { useAuth } from "@/store/useAuth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSocketEvents } from '@/hooks/useSocketEvents'

export default function AdminPage() {
  const { isAdmin, token } = useAuth()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!isAdmin) {
      alert("관리자만 접근 가능합니다.")
      router.push("/")
    } else {
      fetch("http://localhost:4000/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setMessage(data.message))

      fetchUsers();
      fetchTransactions();
    }
  }, [mounted, isAdmin, token])

  const handleDeleteUser = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    await fetch(`http://localhost:4000/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setUsers(users.filter((u) => u.id !== id))
  }

  const handleToggleAdmin = async (id: number, newStatus: boolean) => {
    await fetch(`http://localhost:4000/admin/users/${id}/admin`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isAdmin: newStatus }),
    })
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, isAdmin: newStatus } : u
      )
    )
  }

  const handleStatusUpdate = async (id: number, status: "approved" | "rejected") => {
    await fetch(`http://localhost:4000/admin/transactions/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
    setTransactions(
      transactions.map((tx) =>
        tx.id === id ? { ...tx, status } : tx
      )
    )
  }

  const fetchUsers = async () => {
    fetch("http://localhost:4000/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setUsers([]))
  }
  const fetchTransactions = async () => {
    fetch("http://localhost:4000/admin/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch(() => setTransactions([]))
  }

  useSocketEvents({
    onAdminTxUpdate: fetchTransactions,
  })

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">관리자 페이지</h1>
      <p className="mb-6">{message}</p>

      <div className="w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-2">전체 유저 목록</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">isAdmin</th>
              <th className="border px-2 py-1">액션</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="border px-2 py-1">{user.id}</td>
                <td className="border px-2 py-1">{user.email}</td>
                <td className="border px-2 py-1">{user.isAdmin ? "✅" : "❌"}</td>
                <td className="border px-2 py-1 space-x-1">
                  <button
                    onClick={() => handleToggleAdmin(user.id, !user.isAdmin)}
                    className="text-blue-500 underline text-xs"
                  >
                    {user.isAdmin ? "권한 제거" : "관리자 지정"}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-500 underline text-xs"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full max-w-xl mt-10">
        <h2 className="text-xl font-semibold mb-2">입출금 내역</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">유저</th>
              <th className="border px-2 py-1">유형</th>
              <th className="border px-2 py-1">금액</th>
              <th className="border px-2 py-1">시간</th>
              <th className="border px-2 py-1">상태</th>
              <th className="border px-2 py-1">액션</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="text-center">
                <td className="border px-2 py-1">{tx.id}</td>
                <td className="border px-2 py-1">{tx.userEmail}</td>
                <td className="border px-2 py-1">{tx.type === "deposit" ? "입금" : "출금"}</td>
                <td className="border px-2 py-1">{tx.amount.toLocaleString()}원</td>
                <td className="border px-2 py-1">{new Date(tx.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1">{tx.status}</td>
                <td className="border px-2 py-1 space-x-1">
                  {tx.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(tx.id, "approved")}
                        className="text-green-600 underline text-xs"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(tx.id, "rejected")}
                        className="text-red-600 underline text-xs"
                      >
                        거절
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
