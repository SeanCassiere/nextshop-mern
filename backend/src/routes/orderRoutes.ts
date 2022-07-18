import express from "express";
import {
	addOrderItems,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDelivered,
	getMyOrders,
	getAllOrders,
} from "../controllers/orderController";

import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *   OrderItem:
 *    type: object
 *    required:
 *     - _id
 *     - product
 *     - name
 *     - image
 *     - price
 *     - qty
 *    properties:
 *     _id:
 *      type: string
 *     product:
 *      type: string
 *     name:
 *      type: string
 *     image:
 *      type: string
 *     price:
 *      type: number
 *     qty:
 *      type: number
 *    example:
 *     _id: 5fc3f737a417212e006e9c87
 *     product: 5fc3c9f5b6003a3dc065c572
 *     name: iPhone 11 Pro 256GB Memory
 *     image: '/images/phone.jpg'
 *     price: 599.99
 *     qty: 1
 * */
/**
 * @swagger
 * components:
 *  schemas:
 *   PaymentResult:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *     status:
 *      type: string
 *     update_time:
 *      type: string
 *     email_address:
 *      type: string
 *    example:
 *     id: 2U83018351699992J
 *     status: COMPLETED
 *     update_time: 2020-11-29T19:33:32Z
 *     email_address: 'example@example.com'
 * */
/**
 * @swagger
 * components:
 *  schemas:
 *   ShippingAddress:
 *    type: object
 *    required:
 *     - address
 *     - city
 *     - postalCode
 *     - country
 *    properties:
 *     address:
 *      type: string
 *     city:
 *      type: string
 *     postalCode:
 *      type: string
 *     country:
 *      type: string
 *    example:
 *     address: 110 Main Street
 *     city: BOSTON
 *     postalCode: 020112
 *     country: USA
 * */
/**
 * @swagger
 * components:
 *  schemas:
 *   Order:
 *    type: object
 *    required:
 *     - _id
 *     - taxPrice
 *     - shippingPrice
 *     - totalPrice
 *     - user
 *     - orderItems
 *     - shippingAddress
 *    properties:
 *     _id:
 *      type: string
 *     taxPrice:
 *      type: number
 *     shippingPrice:
 *      type: number
 *     totalPrice:
 *      type: number
 *     isPaid:
 *      type: boolean
 *     isDeliver:
 *      type: boolean
 *     user:
 *      type: string
 *     shippingAddress:
 *      type: array
 *      $ref: '#/components/schemas/ShippingAddress'
 *     paymentMethod:
 *      type: string
 *     createdAt:
 *      type: string
 *     updatedAt:
 *      type: string
 *     paidAt:
 *      type: string
 *     paymentResult:
 *      type: array
 *      $ref: '#/components/schemas/PaymentResult'
 *     deliveredAt:
 *      type: string
 *     orderItems:
 *      type: array
 *      $ref: '#/components/schemas/OrderItem'
 *    example:
 *     _id: 601dc2619e65700f34173858
 *     taxPrice: 90
 *     shippingPrice: 0.00
 *     totalPrice: 689.99
 *     isPaid: true
 *     isDeliver: false
 *     user: 5fc2b7d1b9b6255e64167bdc
 *     shippingAddress:
 *      address: '110 Main Street'
 *      city: 'BOSTON'
 *      postalCode: 020112
 *      country: 'USA'
 *     paymentMethod: PayPal
 *     createdAt: 2020-12-01T10:15:54.900+00:00
 *     updatedAt: 2020-12-01T10:15:54.900+00:00
 *     paidAt: 2020-12-01T10:16:24.404+00:00
 *     paymentResult:
 *      id: 2U83018351699992J
 *      status: COMPLETED
 *      update_time: 2020-11-29T19:33:32Z
 *      email_address: 'example@example.com'
 *     deliveredAt: 2021-02-05T21:33:51.401+00:00
 *     orderItems:
 *      - _id: 5fc3f737a417212e006e9c87
 *        product: 5fc3c9f5b6003a3dc065c572
 *        name: iPhone 11 Pro 256GB Memory
 *        image: '/images/phone.jpg'
 *        price: 599.99
 *        qty: 1
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders with limited fields
 *     tags: [Orders, Admin]
 *     parameters:
 *      - in: query
 *        name: pageNumber
 *        schema:
 *         type: number
 *        required: false
 *        description: The pagination page number
 *      - in: query
 *        name: pageSize
 *        schema:
 *         type: number
 *        required: false
 *        description: The pagination page size
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Query completed
 *       401:
 *         description: Not Authorized
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     summary: Place an order
 *     tags: [Orders, Private]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *      description: The pagination page number
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          orderItems:
 *           type: array
 *           items:
 *            $ref: '#/components/schemas/OrderItem'
 *          shippingAddress:
 *           type: object
 *           $ref: '#/components/schemas/ShippingAddress'
 *          paymentMethod:
 *           type: string
 *          itemsPrice:
 *            type: number
 *          taxPrice:
 *             type: number
 *          shippingPrice:
 *             type: number
 *          totalPrice:
 *             type: number
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *          description: Not Authorized
 *          $ref: '#/components/responses/UnauthorizedError'
 */
router.route("/").post(protect, addOrderItems).get(protect, isAdmin, getAllOrders);

/**
 * @swagger
 * /orders/myorders:
 *   get:
 *     summary: Get all orders for user
 *     tags: [Orders, Private]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Query completed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not Authorized
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.route("/myorders").get(protect, getMyOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by id for user
 *     tags: [Orders, Private]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *         type: string
 *        required: false
 *        description: The unique id given to the order
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Query completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Not Authorized
 *         $ref: '#/components/responses/UnauthorizedError'
 *       401:
 *         description: Not Authorized
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:id").get(protect, getOrderById);

/**
 * @swagger
 * /orders/{id}/pay:
 *   put:
 *     summary: Order paid, mark true
 *     tags: [Orders, Private]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *         type: string
 *        required: false
 *        description: The unique id given to the order
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Marked as paid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Not Authorized
 *         $ref: '#/components/responses/UnauthorizedError'
 *       401:
 *         description: Not Authorized
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:id/pay").put(protect, updateOrderToPaid);

/**
 * @swagger
 * /orders/{id}/deliver:
 *   put:
 *     summary: Order delivered, mark true
 *     tags: [Orders, Admin]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *         type: string
 *        required: false
 *        description: The unique id given to the order
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Marked as delivered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Not Authorized
 *         $ref: '#/components/responses/UnauthorizedError'
 *       401:
 *         description: Not Authorized
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:id/deliver").put(protect, isAdmin, updateOrderToDelivered);

export default router;
