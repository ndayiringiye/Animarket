import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import animalRoute from "./src/routes/Animal/animalRoutes.js";
import agreement from "./src/routes/Agreements/agreementRoutes.js";
import meetingRoute from "./src/routes/Meeting/meetingRoute.js";
const app = express();
dotenv.config();

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

app.get("/", (req , res ) =>{
    res.send("server defualt is running ");
});

app.use("/api/users", userRoutes);
app.use("/api/animal", animalRoute);
app.use("/api/meeting", meetingRoute);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();

