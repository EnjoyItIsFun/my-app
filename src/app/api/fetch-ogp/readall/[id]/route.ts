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
    try {
        console.log('データベース接続を開始します');
        await connectDB();
        console.log('データベース接続が成功しました');
        
        //パラメータの確認
        const userId = context.params.id;
        console.log('リクエストされたユーザーID:', userId);

        //クエリの実行
        const userCards = await CardModel.find({
            userId: new mongoose.Types.ObjectId(userId)
        });

        console.log('取得されたカード:', JSON.stringify(userCards, null, 2));

        if (!userCards || userCards.length === 0) {
            // カードが見つからない場合の処理
            console.log('カードが見つかりませんでした');
            return NextResponse.json({ 
                message: "カードが見つかりません",
                cards: [] 
            });
        }

        
        return NextResponse.json({ message: "カード読み取り成功", cards: userCards });
    } catch (err) {
        console.error('詳細なエラー情報:', err);
        return NextResponse.json({ 
            message: "カード読み取り失敗",
            error: (err as Error).message 
        }, { 
            status: 500 
        });
    }
}

export const revalidate = 0;