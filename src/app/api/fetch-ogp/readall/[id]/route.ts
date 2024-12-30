import { NextResponse, NextRequest } from "next/server"
import connectDB from "../../../../utils/database"
import { CardModel } from "../../../../utils/schemaModels"
import mongoose from "mongoose"

interface Context {
    params: {
        id: string;
    };
}
export async function GET(request: NextRequest,
    context: Context) {
//     try {
//         console.log('データベース接続を開始します');
//         await connectDB();
//         console.log('データベース接続が成功しました');
        
//         //パラメータの確認
//         const userId = context.params.id;
//         console.log('リクエストされたユーザーID:', userId);

//         //クエリの実行
//         const userCards = await CardModel.find({
//             userId: new mongoose.Types.ObjectId(userId)
//         });

//         console.log('取得されたカード:', JSON.stringify(userCards, null, 2));

//         if (!userCards || userCards.length === 0) {
//             // カードが見つからない場合の処理
//             console.log('カードが見つかりませんでした');
//             return NextResponse.json({ 
//                 message: "カードが見つかりません",
//                 cards: [] 
//             });
//         }

        
//         return NextResponse.json({ message: "カード読み取り成功", cards: userCards });
//     } catch (err) {
//         console.error('詳細なエラー情報:', err);
//         return NextResponse.json({ 
//             message: "カード読み取り失敗",
//             error: (err as Error).message 
//         }, { 
//             status: 500 
//         });
//     }
// }
try {
    // リクエストパラメータの確認
    const userId = context.params.id;
    console.log("カード取得リクエストを受信しました。ユーザーID:", userId);

    // 環境変数の確認
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URIが設定されていません");
        throw new Error("データベース設定が見つかりません");
    }

    // データベース接続
    try {
        console.log("データベース接続を開始します...");
        await connectDB();
        console.log("データベースに正常に接続しました");
    } catch (error: unknown) {
        const err = error as Error;
        console.error("データベース接続エラー:", {
            message: err.message,
            name: err.name,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
        throw new Error(`データベース接続に失敗しました: ${err.message}`);
    }

    // ユーザーIDの形式を検証
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("無効なユーザーID形式です:", userId);
        return NextResponse.json(
            { message: "無効なユーザーID形式です" },
            { status: 400 }
        );
    }

    // カードの検索
    console.log("カードの検索を開始します...");
    const userCards = await CardModel.find({
        userId: new mongoose.Types.ObjectId(userId)
    });
    console.log(`検索結果: ${userCards.length}件のカードが見つかりました`);

    // 結果の返却
    return NextResponse.json({
        message: "カード読み取り成功",
        cards: userCards
    });

} catch (error: unknown) {
    // エラーの詳細なログ出力
    const err = error as Error;
    console.error("カード取得処理エラーの詳細:", {
        message: err.message,
        name: err.name,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    return NextResponse.json({
        message: "カード読み取り失敗",
        error: err.message
    }, {
        status: 500
    });
}
}

export const revalidate = 0;