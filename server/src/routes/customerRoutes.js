import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

// Only admin can create, update, or delete customers
router.post("/", authenticate, authorize(["admin"]), createCustomer);
router.put("/:id", authenticate, authorize(["admin"]), updateCustomer);
router.delete("/:id", authenticate, authorize(["admin"]), deleteCustomer);

// Both admin and employee can view customers
router.get("/", authenticate, getCustomers);

export default router;
