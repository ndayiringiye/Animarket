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
import hotelRoutes from "./src/routes/Hotels/hotelRoutes.js";
import veterinaryRoutes from "./src/routes/Veterinary/veterinaryRoutes.js";
import agreemenRoutes from "./src/routes/Agreements/agreementRoutes.js";
import HotelsRoutes from "./src/routes/Hotels/hotelRoutes.js";
import bookingRoute from "./src/routes/Booking/bookingRoute.js";
const app = express();
dotenv.config();

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 4000;

app.get("/", (req , res ) =>{
    res.send("server defualt is running ");
});

app.use("/api/users", userRoutes);
app.use("/api/animal", animalRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/agreements", agreement);
app.use("/api/meeting", meetingRoute);
app.use("/api/hotels", hotelRoutes);
app.use("/api/veterinary", veterinaryRoutes);
app.use("/api/agreements", agreemenRoutes);   
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

