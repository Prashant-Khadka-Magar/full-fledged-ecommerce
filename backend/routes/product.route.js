import express from "express";
import {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getSearchSuggestions,
  getRelatedProductsById,
  replyToReview,
  getFeaturedProducts,
} from "../controllers/product.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route('/featured').get(getFeaturedProducts)
router
.route("/:id")
.get(getProductById)
.put(
  protect,
  admin,
  upload.fields([{ name: "image", maxCount: 3 }]),
  updateProduct
  )
  .delete(protect, admin, deleteProduct);

router.route("/:id/reviews").post(protect, createProductReview);
router.route("/:id/reviews/:reviewId/reply").post(protect,admin, replyToReview);
router.route("/suggestions/:keyword").get(getSearchSuggestions);
router.route("/:id/related").get(getRelatedProductsById);

export default router;
