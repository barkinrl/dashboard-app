const express = require("express");
const mongoose = require("mongoose");
const userController = require("./controllers/userController");

const app = express();
app.use(express.json());

//MongoDB conn
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB (Customer Service)"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Signup
app.post("/signup", userController.signup);

// Signin
app.post("/signin", userController.signin);

app.listen(3001, () => console.log("User service running on port 3001"));
