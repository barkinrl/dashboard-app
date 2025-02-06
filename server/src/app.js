import express from "express";
import cors from "cors";
import "dotenv/config"; // .env dosyasını yükler
import { connectDB } from "./config/db.js"; // db.js dosyanın ESM formatında olduğundan emin ol
import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import cookieParser from "cookie-parser";
import { authenticate } from "./middleware/authMiddleware.js";
//import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
connectDB();

// Routes
app.use("/api/user", userRoutes);

// Additional routes for customers and sales (ensure protected with authenticate middleware)
app.use("/api/customers", authenticate, customerRoutes);
app.use("/api/sales", authenticate, salesRoutes);

// Error handler
//app.use(errorHandler);

export default app;
