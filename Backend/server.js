import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "../Backend/src/config/db.js"
import userRoutes from "./src/routes/userRoutes.js"

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

app.get("/", (req , res ) =>{
    res.send("server defualt is running ");
});

app.use("/api/users", userRoutes);

app.listen(PORT, async ()=>{
    await connectDB()
 try {
    console.log(`server is running on port ${PORT}`);
 } catch (error) {
    console.log("server running failed")
 }
})

