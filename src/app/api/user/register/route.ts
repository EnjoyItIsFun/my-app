import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { UserModel } from "../../../utils/schemaModels"
import mongoose from "mongoose"

// MongoDBへの接続を管理する関数
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
        // リクエストボディからユーザー情報を取得
        const { email, password } = await request.json()

        // 入力値の検証
        if (!email || !password) {
            return NextResponse.json(
                { message: "メールアドレスとパスワードは必須です" },
                { status: 400 }
            )
        }

        // パスワードの長さチェック
        if (password.length < 8) {
            return NextResponse.json(
                { message: "パスワードは8文字以上である必要があります" },
                { status: 400 }
            )
        }

        // メールアドレスの形式チェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "有効なメールアドレスを入力してください" },
                { status: 400 }
            )
        }

        // データベースに接続
        await connectDB()

        // メールアドレスの重複チェック
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { message: "このメールアドレスは既に登録されています" },
                { status: 409 }
            )
        }

        // パスワードのハッシュ化
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // 新しいユーザーの作成
        const newUser = new UserModel({
            email,
            password: hashedPassword
        })

        // データベースに保存
        await newUser.save()

        // 成功レスポンス
        return NextResponse.json(
            { message: "ユーザー登録が完了しました" },
            { status: 201 }
        )

    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { message: "サーバーエラーが発生しました" },
            { status: 500 }
        )
    }
}