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
import deliveryRoutes from "./src/routes/Delivery/deliveryRoutes.js";
import interestRoutes from "./src/routes/Interest/interestRoutes.js";
import chatRoutes from "./src/routes/Chat/chatRoutes.js";
import trustRoutes from "./src/routes/Trust/trustRoutes.js";
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
app.use("/api/delivery", deliveryRoutes);
app.use("/api/interest", interestRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/trust", trustRoutes);
// global error handler to capture unexpected errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: err?.message || 'Server error', status: 500 });
});
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

