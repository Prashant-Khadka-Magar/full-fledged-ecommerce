import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    expiresIn: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
