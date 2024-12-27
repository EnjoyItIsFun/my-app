// import { NextResponse } from "next/server"
// import { SignJWT } from "jose" 
// import connectDB from "../../../utils/database"
// import { UserModel } from "../../../utils/schemaModels"

// import { NextRequest } from "next/server"

// export async function POST(request: NextRequest) {
//     const reqBody = await request.json()
//     try{
//         await connectDB()
//         const savedUserData = await UserModel.findOne({email: reqBody.email})
//         if(savedUserData){
//             // ユーザーデータが存在する場合の処理
//             if(reqBody.password === savedUserData.password){
//                 // パスワードが正しい場合の処理
//                 const secretKey = new TextEncoder().encode("next-market-app-book")

//                 const payload = {
//                     email: reqBody.email, 
//                 }

//                 const token = await new SignJWT(payload)
//                                         .setProtectedHeader({alg: "HS256"})
//                                         .setExpirationTime("1d")
//                                         .sign(secretKey)
//                 return NextResponse.json({message: "ログイン成功", token: token})
//             }else{
//                 // パスワードが間違っている場合の処理
//                 return NextResponse.json({message: "ログイン失敗：パスワードが間違っています"})
//             }
//         }else{
//             // ユーザーデータが存在しない場合の処理
//             return NextResponse.json({message: "ログイン失敗：ユーザー登録をしてください"})
//         }
//     }catch{
//         return NextResponse.json({message: "ログイン失敗"}) 
//     } 
// }



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

        // バリデーション
        if (!email || !password) {
            return NextResponse.json(
                { message: "メールアドレスとパスワードは必須です" },
                { status: 400 }
            )
        }

        // データベースに接続
        await connectDB()

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
        return NextResponse.json(
            { message: "ログイン成功" },
            { status: 200 }
        )

    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { message: "サーバーエラーが発生しました" },
            { status: 500 }
        )
    }
}