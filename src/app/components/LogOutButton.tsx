"use client"

import { useRouter } from "next/navigation"
import LogoutIcon from '@mui/icons-material/Logout'

export default function LogOutButton() {

    const router = useRouter()

    const handleLogout = async () => {
        try {
          // 1. ローカルストレージからトークンを削除
          localStorage.removeItem("token");
    
          // 2. 認証状態をリセットするためにアプリケーションの状態もリセットする（必要なら）
          // 例: ReduxやContextを利用している場合に、認証フラグをfalseにする
    
          // 3. ログインページへリダイレクト
          router.replace("/");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      };

    return (
        <div>
                <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200">
                    <LogoutIcon />
                </button>
        </div>

    )
}