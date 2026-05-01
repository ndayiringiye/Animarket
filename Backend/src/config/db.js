import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns"; // Use the standard node:dns

dotenv.config();

// This forces Node to use Google/Cloudflare instead of your ISP's DNS
dns.setDefaultResultOrder("ipv4first"); 
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); 

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
export default connectDb;