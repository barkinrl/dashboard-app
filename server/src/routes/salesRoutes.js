import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import {
  createSale,
  getSales,
  updateSaleStatus,
  deleteSale,
} from "../controllers/salesController.js";

const router = express.Router();

// Only admin can create or delete sales
router.post("/", authenticate, authorize(["admin"]), createSale);
router.delete("/:id", authenticate, authorize(["admin"]), deleteSale);

// Both admin and employee can view sales
router.get("/", authenticate, getSales);

// Only admin can update sale status
router.put("/:id", authenticate, authorize(["admin"]), updateSaleStatus);

export default router;
