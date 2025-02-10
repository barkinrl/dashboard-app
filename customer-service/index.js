const express = require("express");
const mongoose = require("mongoose");
const customerController = require("./controllers/customerController");

const app = express();
app.use(express.json());

// MongoDB conn
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB (Customer Service)"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
// Create a new customer
app.post("/customers", customerController.createCustomer);

// Get all customers
app.get("/customers", customerController.getAllCustomers);

// Get a single customer by ID
app.get("/customers/:id", customerController.getCustomerById);

// Update a customer by ID
app.put("/customers/:id", customerController.updateCustomer);

// Delete a customer by ID
app.delete("/customers/:id", customerController.deleteCustomer);

app.listen(3002, () => console.log("Customer service running on port 3002"));
