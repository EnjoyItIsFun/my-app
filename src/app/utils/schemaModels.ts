import mongoose from "mongoose"

const Schema = mongoose.Schema

// const CardSchema = new Schema({
//     title: String,       
//     image: String,    
//     description: String,
//     url: String,
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     }
// })
const CardSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true  // createdAt, updatedAtフィールドを自動で追加
});

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

export const CardModel = mongoose.models.Card || mongoose.model("Card", CardSchema)
export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema)




// import mongoose, { Document, Model, Schema } from "mongoose";

// // Cardのインターフェース
// interface Card {
//   title: string;
//   image: string;
//   description: string;
//   url: string;
// }

// // Userのインターフェース
// interface User {
//   email: string;
//   password: string;
// }

// // CardSchema定義
// const CardSchema = new Schema<Card>({
//   title: { type: String, required: true },
//   image: { type: String, required: true },
//   description: { type: String, required: true },
//   url: { type: String, required: true },
// });

// // UserSchema定義
// const UserSchema = new Schema<User>({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// // 型情報を含むGlobal定義
// interface GlobalWithMongoose extends NodeJS.Global {
//   mongoose: {
//     Card?: Model<Card & Document>;
//     User?: Model<User & Document>;
//   };
// }

// const globalWithMongoose: GlobalWithMongoose = global as unknown as GlobalWithMongoose;

// if (!globalWithMongoose.mongoose) {
//   globalWithMongoose.mongoose = {};
// }

// // Cardモデル
// const CardModel =
//   process.env.NODE_ENV === "development"
//     ? (globalWithMongoose.mongoose.Card || (globalWithMongoose.mongoose.Card = mongoose.model<Card & Document>("Card", CardSchema)))
//     : mongoose.models.Card || mongoose.model<Card & Document>("Card", CardSchema);

// // Userモデル
// const UserModel =
//   process.env.NODE_ENV === "development"
//     ? (globalWithMongoose.mongoose.User || (globalWithMongoose.mongoose.User = mongoose.model<User & Document>("User", UserSchema)))
//     : mongoose.models.User || mongoose.model<User & Document>("User", UserSchema);

// export { CardModel, UserModel };

