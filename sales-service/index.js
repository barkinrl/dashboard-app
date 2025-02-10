const express = require("express");
const mongoose = require("mongoose");
const salesController = require("./controllers/saleController");

const app = express();
app.use(express.json());

// MongoDB conn
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB (Customer Service)"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create a new sale
app.post("/sales", salesController.createSale);

// Get all sales
app.get("/sales", salesController.getAllSales);

// Get a single sale by ID
app.get("/sales/:id", salesController.getSaleById);

// Update a sale by ID
app.put("/sales/:id", salesController.updateSale);

// Delete a sale by ID
app.delete("/sales/:id", salesController.deleteSale);

app.listen(3003, () => console.log("Sales service running on port 3003"));
