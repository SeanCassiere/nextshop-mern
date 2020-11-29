import express from 'express'
import {
  getProductById,
  getActiveProducts,
  deleteProductById,
  getAllProducts,
} from '../controllers/productController.js'

import { protect, isAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/all').get(protect, isAdmin, getAllProducts)
router.route('/').get(getActiveProducts)
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, isAdmin, deleteProductById)

export default router
