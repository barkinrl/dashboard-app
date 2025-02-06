import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login user and set JWT as a cookie
router.post("/login", loginUser);

// Admin-only operation
router.get("/", authenticate, authorize(["admin"]), (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

export default router;
