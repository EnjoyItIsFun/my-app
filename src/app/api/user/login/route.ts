// import { NextResponse } from "next/server"
// import bcrypt from "bcryptjs"
// import { UserModel } from "../../../utils/schemaModels"
// import mongoose from "mongoose"

// // MongoDB接続用の関数
// async function connectDB() {
//     try {
//         if (mongoose.connection.readyState === 0) {
//             await mongoose.connect(process.env.MONGODB_URI!)
//             console.log("Connected to MongoDB")
//         }
//     } catch (error) {
//         console.error("MongoDB connection error:", error)
//         throw new Error("Failed to connect to database")
//     }
// }

// export async function POST(request: Request) {
//     try {
//         // リクエストボディからメールアドレスとパスワードを取得
//         const { email, password } = await request.json()
//         await connectDB();

//         // ユーザーを検索
//         const user = await UserModel.findOne({ email })
//         if (!user) {
//             return NextResponse.json(
//                 { message: "ユーザーが見つかりません" },
//                 { status: 401 }
//             )
//         }

//         // パスワードの照合
//         const isPasswordValid = await bcrypt.compare(password, user.password)
    
//         if (!isPasswordValid) {
//             return NextResponse.json(
//                 { message: "パスワードが正しくありません" },
//                 { status: 401 }
//             )
//         }

//         // ログイン成功
//         return NextResponse.json({
//             message: "ログイン成功",
//             userId: user._id.toString(),
//             status: 200
//         })

//     } catch (error) {
//         console.error("Login error:", error)
//         return NextResponse.json(
//             { message: "サーバーエラーが発生しました" },
//             { status: 500 }
//         )
//     }
// }
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { UserModel } from "../../../utils/schemaModels"
import mongoose from "mongoose"

// データベース接続関数の改善
async function connectDB() {
    try {
        // 環境変数の存在確認を追加
        if (!process.env.MONGODB_URI) {
            throw new Error("データベース接続URLが設定されていません");
        }

        // 接続状態の詳細なチェック
        if (mongoose.connection.readyState === 0) {
            console.log("データベース接続を開始します...");
            await mongoose.connect(process.env.MONGODB_URI);
            console.log("データベースに正常に接続しました");
        } else {
            console.log("既存のデータベース接続を使用します");
        }
    } catch (error: unknown) {
        // より詳細なエラー情報を記録
        const err = error as Error;
        console.error("データベース接続エラーの詳細:", {
            message: err.message,
            name: err.name,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
        throw new Error(`データベース接続に失敗しました: ${err.message}`);
    }
}

export async function POST(request: Request) {
    try {
        // リクエストの解析を try-catch で囲む
        let email, password;
        try {
            const body = await request.json();
            email = body.email;
            password = body.password;

            // 必須パラメータの検証
            if (!email || !password) {
                return NextResponse.json(
                    { message: "メールアドレスとパスワードは必須です" },
                    { status: 400 }
                );
            }
        } catch {
            return NextResponse.json(
                { message: "リクエストの解析に失敗しました" },
                { status: 400 }
            );
        }

        // データベース接続
        await connectDB();
        console.log("データベース接続が確立されました");

        // ユーザー検索処理の詳細なログ
        console.log(`ユーザー検索を開始: ${email}`);
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            console.log(`ユーザーが見つかりません: ${email}`);
            return NextResponse.json(
                { message: "ユーザーが見つかりません" },
                { status: 401 }
            );
        }
        console.log("ユーザーが見つかりました、パスワード検証を開始します");

        // パスワードの照合
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            console.log("パスワード検証に失敗しました");
            return NextResponse.json(
                { message: "パスワードが正しくありません" },
                { status: 401 }
            );
        }

        console.log("ログイン認証が成功しました");
        return NextResponse.json({
            message: "ログイン成功",
            userId: user._id.toString(),
            status: 200
        });

    } catch (error) {
        const err = error as Error;
        console.error("ログインプロセスエラーの詳細:", {
            message: err.message,
            name: err.name,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
        // クライアントへのエラーレスポンス
        return NextResponse.json(
            { 
                message: "サーバーエラーが発生しました",
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            },
            { status: 500 }
        );
    }
}