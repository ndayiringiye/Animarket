import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://ndayiringiyedavid120_db_user:tjuz0pcsqOf8XisC@cluster0.cyoeixv.mongodb.net/Animarketing?retryWrites=true&w=majority", {
      dbName: "Animarketing",
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDb;