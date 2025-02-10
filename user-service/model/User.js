const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["boss", "employee"], default: "employee" },
});

module.exports = mongoose.model("User", userSchema);
