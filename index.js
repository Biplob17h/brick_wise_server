import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import colors from "colors";
import connectDb from "./db/db.js";
import userRoute from "./routes/userRoutes.js";
import productRoute from "./routes/productRoutes.js";

// Configuration

dotenv.config();

// Application
const app = express();

// Middlewares

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)

// Homepage

app.get("/", (req, res) => {
  res.send("Welcome to Brick Wise server");
});

// Listen Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDb()
  console.log(`Server running on port ${PORT}`.cyan.bold);
});
