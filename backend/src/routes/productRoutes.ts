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

/**
 * @swagger
 * components:
 *  schemas:
 *   Review:
 *    type: object
 *    required:
 *     - comment
 *     - rating
 *    properties:
 *     _id:
 *      type: string
 *     user:
 *      type: string
 *     rating:
 *      type: number
 *      description: A rating from 1 - 5
 *     comment:
 *      type: string
 *     createdAt:
 *      type: string
 *     updatedAt:
 *      type: string
 *    example:
 *      _id: 601dc2619e65700f34173858
 *      name: John Doe
 *      rating: 3
 *      comment: Could have certainly been better
 *      user: 5fc2b7d1b9b6255e64167bdb
 *      createdAt: 2021-02-05T22:10:41.689+00:00
 *      updatedAt: 2021-02-05T22:10:41.689+00:00
 *   Product:
 *    type: object
 *    required:
 *     - user
 *     - name
 *     - image
 *     - brand
 *     - description
 *     - category
 *     - price
 *     - countInStock
 *     - isActive
 *    properties:
 *     _id:
 *      type: string
 *     user:
 *      type: string
 *     name:
 *      type: string
 *     image:
 *      type: string
 *     brand:
 *      type: string
 *     description:
 *      type: string
 *     category:
 *      type: string
 *     price:
 *      type: number
 *     countInStock:
 *      type: number
 *     isActive:
 *      type: boolean
 *     reviews:
 *      type: array
 *      $ref: '#/components/schemas/Review'
 *     createdAt:
 *      type: string
 *     updatedAt:
 *      type: string
 *     __v:
 *      type: number
 *    example:
 *     _id: 5fc3c9f5b6003a3dc065c574
 *     user: 5fc2b7d1b9b6255e64167bda
 *     name: iPhone 11 Pro 256GB Memory
 *     image: /images/phone.jpg
 *     brand: Apple
 *     description: "Introducing the iPhone 11 Pro. A transformative triple-camera system t..."
 *     category: Electronics
 *     price: 89.99
 *     countInStock: 8
 *     isActive: true
 *     createdAt: 2020-11-29T16:19:01.560+00:00
 *     updatedAt: 2020-11-29T16:19:01.560+00:00
 *     __v: 0
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns the list of active products
 *     tags: [Products]
 *     parameters:
 *      - in: query
 *        name: pageNumber
 *        schema:
 *         type: number
 *        required: false
 *        description: The pagination page number
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Not Authorized
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.route("/").get(getActiveProducts).post(protect, isAdmin, createProduct);

/**
 * @swagger
 * /products/all:
 *   get:
 *     summary: "Returns the list of all products, both Active and Inactive"
 *     tags: [Products]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: query
 *        name: pageNumber
 *        schema:
 *         type: number
 *        required: false
 *        description: The pagination page number
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.route("/all").get(protect, isAdmin, getAllProducts);

/**
 * @swagger
 * /products/top:
 *   get:
 *     summary: Returns the list of top products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.route("/top").get(getTopProducts);

/**
 * @swagger
 * /products/{productId}/reviews:
 *   post:
 *     summary: Create a product review of a product by the ID
 *     tags: [Products]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: productId
 *        schema:
 *         type: string
 *        required: true
 *        description: The unique id given to the product
 *     requestBody:
 *      description: Product review rating and comment
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          rating:
 *           type: number
 *          comment:
 *           type: string
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                 type: string
 *       401:
 *         description: Not Authorized
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Not Found
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:id/reviews").post(protect, createProductReviewById);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Returns a product by the product Id
 *     tags: [Products]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *         type: string
 *        required: false
 *        description: The unique id given to the product
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Not Found
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Deletes a product by the product Id
 *     tags: [Products]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *         type: string
 *        required: false
 *        description: The unique id given to the product
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                 type: string
 *       401:
 *         description: Not Found
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Not Found
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     summary: Updates a product by the product Id
 *     tags: [Products]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *         type: string
 *        required: false
 *        description: The unique id given to the product
 *     requestBody:
 *      description: The product data required to update the product
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          name:
 *           type: string
 *          price:
 *           type: number
 *          description:
 *           type: string
 *          image:
 *           type: string
 *          brand:
 *           type: string
 *          category:
 *           type: string
 *          countInStock:
 *           type: number
 *          isActive:
 *           type: boolean
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Not Found
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Not Found
 *         $ref: '#/components/responses/NotFoundError'
 */
router
	.route("/:id")
	.get(getProductById)
	.delete(protect, isAdmin, deleteProductById)
	.put(protect, isAdmin, updateProductById);

export default router;
