import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
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
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       403:
 *         description: Forbidden - Only admin can create customers
 */

// Only admin can create, update, or delete customers
router.post("/", authenticate, authorize(["admin"]), createCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update an existing customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
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
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       403:
 *         description: Forbidden - Only admin can update customers
 */

router.put("/:id", authenticate, authorize(["admin"]), updateCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       403:
 *         description: Forbidden - Only admin can delete customers
 */

router.delete("/:id", authenticate, authorize(["admin"]), deleteCustomer);

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get a list of customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   company:
 *                     type: string
 */

// Both admin and employee can view customers
router.get("/", authenticate, getCustomers);

export default router;
