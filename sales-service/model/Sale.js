const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  productName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["New", "Contact", "Deal", "Closed"],
    default: "New",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sale", saleSchema);
