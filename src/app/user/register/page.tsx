"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // フォーム送信時の処理
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // クライアントサイドでのバリデーション
        if (password !== confirmPassword) {
            setError("パスワードが一致しません")
            return
        }

        if (password.length < 8) {
            setError("パスワードは8文字以上である必要があります")
            return
        }

        setLoading(true)

        try {
            const response = await fetch("/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "登録に失敗しました")
            }

            // 登録成功時の処理
            router.push("/?registered=true") // ログインページへリダイレクト
            
        } catch (error) {
            setError(error instanceof Error ? error.message : "エラーが発生しました")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">アカウント登録</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            パスワード
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
                            required
                            minLength={8}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            8文字以上で入力してください
                        </p>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            パスワード（確認）
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? "登録中..." : "登録する"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    既にアカウントをお持ちの方は{" "}
                    <Link href="/" className="text-blue-600 hover:text-blue-500">
                        こちらからログイン
                    </Link>
                </p>
            </div>
        </div>
    )
}