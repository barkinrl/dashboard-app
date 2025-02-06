import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Contact", "Deal", "Closed"],
      default: "New",
    },
    notes: [{ content: String, date: { type: Date, default: Date.now } }],
    statusHistory: [
      { status: String, date: { type: Date, default: Date.now } },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
