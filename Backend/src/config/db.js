import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Animarketing",
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Database connected successfully:", conn.connection.host);

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDb;