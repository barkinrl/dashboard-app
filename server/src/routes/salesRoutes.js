import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import {
  createSale,
  getSales,
  updateSaleStatus,
  deleteSale,
} from "../controllers/salesController.js";

const router = express.Router();

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The customer ID related to the sale
 *               status:
 *                 type: string
 *                 description: The initial status of the sale
 *               notes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Notes related to the sale
 *     responses:
 *       201:
 *         description: Sale created successfully
 *       403:
 *         description: Forbidden - Only admin can create sales
 */

// Only admin can create or delete sales
router.post("/", authenticate, authorize(["admin"]), createSale);

/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     summary: Delete a sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale ID
 *     responses:
 *       200:
 *         description: Sale deleted successfully
 *       403:
 *         description: Forbidden - Only admin can delete sales
 */

router.delete("/:id", authenticate, authorize(["admin"]), deleteSale);

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Retrieve a list of sales
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of sales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The sale ID
 *                   status:
 *                     type: string
 *                     description: The status of the sale
 *                   notes:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Notes related to the sale
 */

// Both admin and employee can view sales
router.get("/", authenticate, getSales);

/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     summary: Update the status of a sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the sale
 *     responses:
 *       200:
 *         description: Sale status updated successfully
 *       403:
 *         description: Forbidden - Only admin can update sale status
 */

// Only admin can update sale status
router.put("/:id", authenticate, authorize(["admin"]), updateSaleStatus);

export default router;
