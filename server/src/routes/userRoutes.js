import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */

// Register a new user
router.post("/register", registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: jwt=yourToken; HttpOnly
 */

// Login user and set JWT as a cookie
router.post("/login", loginUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Admin-only operation to view users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message for admin
 *       403:
 *         description: Forbidden - Only admin can access
 */

// Admin-only operation
router.get("/", authenticate, authorize(["admin"]), (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

export default router;
