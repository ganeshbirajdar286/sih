import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    session_id: { type: String, required: true },
    checkout_url: { type: String, required: true },
    product_id: { type: String, required: true },
    Email: { type: String, required: true },
    Name: { type: String, required: true },
    amount: { type: Number, default: 500 },
    currency: { type: String, default: "INR" },
    status: { type: String, default: "pending" },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
