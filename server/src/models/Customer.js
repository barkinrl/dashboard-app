import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    company: String,
    notes: [{ content: String, date: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
