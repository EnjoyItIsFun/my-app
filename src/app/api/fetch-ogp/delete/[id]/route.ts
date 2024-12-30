// import { NextResponse } from "next/server"
// import connectDB from "../../../../utils/database"
// import { CardModel } from "../../../../utils/schemaModels"

// interface RequestBody {
//     email: string;
// }

// interface ContextParams {
//     id: string;
// }

// interface Context {
//     params: ContextParams;
// }

// export async function DELETE(request: Request, context: Context): Promise<NextResponse> {
//     const reqBody: RequestBody = await request.json();
//     try {
//         await connectDB();
//         const singleItem = await CardModel.findById(context.params.id);
//         if (singleItem.email === reqBody.email) {
//             await CardModel.deleteOne({ _id: context.params.id });
//             return NextResponse.json({ message: "アイテム削除成功" });
//         } else {
//             return NextResponse.json({ message: "他の人が作成したアイテムです" });
//         }
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ message: "アイテム削除失敗" });
//     }
// }

import { NextResponse } from "next/server"
import connectDB from "../../../../utils/database"
import { CardModel } from "../../../../utils/schemaModels"
import mongoose from "mongoose"

interface RequestBody {
    userId: string;  // emailからuserIdに変更
}

interface ContextParams {
    id: string;
}

interface Context {
    params: ContextParams;
}

export async function DELETE(request: Request, context: Context): Promise<NextResponse> {
    const reqBody: RequestBody = await request.json();
    
    try {
        await connectDB();
        
        // MongoDBのObjectIDとして有効かチェック
        if (!mongoose.Types.ObjectId.isValid(context.params.id) || 
            !mongoose.Types.ObjectId.isValid(reqBody.userId)) {
            return NextResponse.json({ message: "無効なIDです" }, { status: 400 });
        }

        // カードの存在確認と所有者チェックを同時に行う
        const singleItem = await CardModel.findOne({
            _id: context.params.id,
            userId: reqBody.userId
        });

        if (!singleItem) {
            return NextResponse.json(
                { message: "カードが見つからないか、削除権限がありません" }, 
                { status: 403 }
            );
        }

        // 削除実行
        await CardModel.deleteOne({ _id: context.params.id });
        return NextResponse.json({ message: "カードを削除しました" }, { status: 200 });

    } catch (err) {
        console.error("削除処理でエラーが発生:", err);
        return NextResponse.json(
            { message: "削除処理中にエラーが発生しました" }, 
            { status: 500 }
        );
    }
}