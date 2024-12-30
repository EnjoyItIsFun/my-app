// import mongoose from "mongoose"

// const connectDB = async() => {
//     try{
        
//         const mongoURI = process.env.MongoDB_URI;
//         if (!mongoURI) {
//             throw new Error("MongoDB URI is not defined");
//         }
//         await mongoose.connect(mongoURI);
//         console.log("Success: Connected to MongoDB")
//     }catch(err){
//         console.error("Failure: Unconnected to MongoDB", err)
//         throw new Error()
//     }
// }

// export default connectDB

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URIが環境変数に設定されていません");
        }

        const dbState = mongoose.connection.readyState;
        console.log("接続試行前のデータベース状態:", dbState);

        if (dbState === 1) {
            console.log("既存の接続を使用します");
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("新しいデータベース接続を確立しました");

    } catch (error: unknown) {
        const err = error as Error;
        console.error("データベース接続エラー:", {
            message: err.message,
            name: err.name,
            stack: err.stack
        });
        throw err;  // エラーを上位に伝播させる
    }
};

export default connectDB;