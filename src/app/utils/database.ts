import mongoose from "mongoose"

const connectDB = async() => {
    try{
        
        const mongoURI = process.env.MongoDB_URI;
        if (!mongoURI) {
            throw new Error("MongoDB URI is not defined");
        }
        await mongoose.connect(mongoURI);
        console.log("Success: Connected to MongoDB")
    }catch(err){
        console.error("Failure: Unconnected to MongoDB", err)
        throw new Error()
    }
}

export default connectDB