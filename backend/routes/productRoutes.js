import express from "express"
import {
  getProductById,
  getActiveProducts,
  deleteProductById,
  getAllProducts,
  updateProductById,
  createProduct,
  createProductReviewById,
} from "../controllers/productController.js"

import { protect, isAdmin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/all").get(protect, isAdmin, getAllProducts)
router.route("/").get(getActiveProducts).post(protect, isAdmin, createProduct)
router.route("/:id/reviews").post(protect, createProductReviewById)
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, isAdmin, deleteProductById)
  .put(protect, isAdmin, updateProductById)

export default router
