import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { UserModel } from "../../../utils/schemaModels"
import mongoose from "mongoose"

// MongoDB接続用の関数
async function connectDB() {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI!)
            console.log("Connected to MongoDB")
        }
    } catch (error) {
        console.error("MongoDB connection error:", error)
        throw new Error("Failed to connect to database")
    }
}

export async function POST(request: Request) {
    try {
        // リクエストボディからメールアドレスとパスワードを取得
        const { email, password } = await request.json()
        await connectDB();

        // ユーザーを検索
        const user = await UserModel.findOne({ email })
        if (!user) {
            return NextResponse.json(
                { message: "ユーザーが見つかりません" },
                { status: 401 }
            )
        }

        // パスワードの照合
        const isPasswordValid = await bcrypt.compare(password, user.password)
    
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "パスワードが正しくありません" },
                { status: 401 }
            )
        }

        // ログイン成功
        return NextResponse.json({
            message: "ログイン成功",
            userId: user._id.toString(),
            status: 200
        })

    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { message: "サーバーエラーが発生しました" },
            { status: 500 }
        )
    }
}