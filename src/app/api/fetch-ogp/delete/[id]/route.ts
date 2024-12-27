import { NextResponse } from "next/server"
import connectDB from "../../../../utils/database"
import { CardModel } from "../../../../utils/schemaModels"

interface RequestBody {
    email: string;
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
        const singleItem = await CardModel.findById(context.params.id);
        if (singleItem.email === reqBody.email) {
            await CardModel.deleteOne({ _id: context.params.id });
            return NextResponse.json({ message: "アイテム削除成功" });
        } else {
            return NextResponse.json({ message: "他の人が作成したアイテムです" });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "アイテム削除失敗" });
    }
}