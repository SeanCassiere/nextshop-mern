import express from "express";
import {
	getProductById,
	getActiveProducts,
	deleteProductById,
	getAllProducts,
	updateProductById,
	createProduct,
	createProductReviewById,
	getTopProducts,
} from "../controllers/productController";

import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").get(getActiveProducts).post(protect, isAdmin, createProduct);
router.route("/all").get(protect, isAdmin, getAllProducts);
router.route("/top").get(getTopProducts);
router.route("/:id/reviews").post(protect, createProductReviewById);
router
	.route("/:id")
	.get(getProductById)
	.delete(protect, isAdmin, deleteProductById)
	.put(protect, isAdmin, updateProductById);

export default router;
