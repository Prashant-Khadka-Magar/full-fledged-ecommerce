import express from "express";
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
} from "../controllers/coupon.controller.js";
import { admin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, createCoupon)
  .get(protect, admin, getAllCoupons);

router.route("/:id").delete(protect, admin, deleteCoupon);
router.route("/apply").post(applyCoupon);

export default router;
