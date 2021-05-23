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
 *      description: The Id of the product
 *     user:
 *      type: string
 *      description: The user who created the product
 *     name:
 *      type: string
 *      description: The name/title of the product
 *     image:
 *      type: string
 *      description: The URL of the product image
 *     brand:
 *      type: string
 *      description: The brand of the product
 *     description:
 *      type: string
 *      description: The description of the product
 *     category:
 *      type: string
 *      description: The category of the product
 *     price:
 *      type: number
 *      description: The price of the product
 *     countInStock:
 *      type: number
 *      description: The number of remaining units in stock for the product
 *     isActive:
 *      type: boolean
 *      description: This controls the availability of the product to the public
 *     createdAt:
 *      type: string
 *      description: The created at date
 *     updatedAt:
 *      type: string
 *      description: The created at date
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
 *     summary: Returns the list of top products
 *     tags: [Products]
 *     security:
 *      - bearerAuth: []
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
