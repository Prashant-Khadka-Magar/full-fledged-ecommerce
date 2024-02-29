import asyncHandler from "../middleware/asyncHandler.js";
import Coupon from "../models/coupon.model.js";

const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiresIn } = req.body;

  if (!name || !discount || !expiresIn) {
    res.status(404);
    throw new Error("Please Provide all the required parameters");
  }

  try {
    const nameExist = await Coupon.findOne({ name });
    if (nameExist) {
      res.status(500);
      throw new Error("Coupon already exists");
    }
    const coupon = new Coupon({
      name,
      discount,
      expiresIn: new Date(expiresIn),
    });

    const savedCoupon = await coupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    throw new Error("Error While Creating Coupon", error);
  }
});

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    let coupons = await Coupon.find({});
    res.status(201).json(coupons);
  } catch (error) {
    throw new Error("Error While Getting Coupon", error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { name } = req.body;
  try {
    const coupon = await Coupon.findOne({ name });

    if (!coupon) {
      throw new Error("Coupon is  wrong ");
    }

    if (coupon.expiresIn <= new Date()) {
      throw new Error("Coupon has been expired");
    }

    res.status(200).json(coupon);
  } catch (error) {
    console.error("Error while applying coupon:", error);
    res.status(500).json({ message: error.message });
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const coupon = await Coupon.findOne({ _id: id });
    if (!coupon) {
      res.status(404);
      throw new Error("Coupon not found");
    }
    await Coupon.deleteOne({ _id: id });
    res.status(200).json("Coupon Deleted successfully");
  } catch (error) {
    res.status(505).json({ message: error.message });
    console.log(error);
  }
});

export { createCoupon, getAllCoupons, deleteCoupon, applyCoupon };
