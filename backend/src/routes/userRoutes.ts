import express from "express";
import {
	authUser,
	registerUser,
	getUserProfile,
	updateUserProfile,
	getUsers,
	deleteUser,
	getUserById,
	updateUser,
} from "../controllers/userController";
import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *  securitySchemes:
 *   bearerAuth:            # arbitrary name for the security scheme
 *    type: http
 *    scheme: bearer
 *    bearerFormat: JWT
 *  responses:
 *   UnauthorizedError:
 *    description: Access token is missing or invalid
 *   NotFoundError:
 *    description: Not found
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    required:
 *     - user
 *     - name
 *    properties:
 *     _id:
 *      type: string
 *     name:
 *      type: string
 *     email:
 *      type: string
 *     password:
 *      type: string
 *     isActive:
 *      type: boolean
 *     createdAt:
 *      type: string
 *     updatedAt:
 *      type: string
 *    example:
 *     _id: 5fc3c9f5b6003a3dc065c574
 *     name: 5fc2b7d1b9b6255e64167bda
 *     email: 'example@example.com'
 *     password: 'ahdjkshajkdlhquihejkshadjlkhq9wuhdjklashdsjklahdlk'
 *     isActive: true
 *     createdAt: 2020-11-29T16:19:01.560+00:00
 *     updatedAt: 2020-11-29T16:19:01.560+00:00
 *   UserNoPassword:
 *    type: object
 *    required:
 *     - user
 *     - name
 *    properties:
 *     _id:
 *      type: string
 *     name:
 *      type: string
 *     email:
 *      type: string
 *     isActive:
 *      type: boolean
 *     createdAt:
 *      type: string
 *     updatedAt:
 *      type: string
 *    example:
 *     _id: 5fc3c9f5b6003a3dc065c574
 *     name: John Doe
 *     email: 'example@example.com'
 *     isActive: true
 *     createdAt: 2020-11-29T16:19:01.560+00:00
 *     updatedAt: 2020-11-29T16:19:01.560+00:00
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a user
 *     tags: [Users, Public]
 *     requestBody:
 *      description: User data to register the user
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          name:
 *           type: string
 *          email:
 *           type: string
 *          password:
 *           type: string
 *     responses:
 *       201:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                _id:
 *                 type: string
 *                name:
 *                 type: string
 *                email:
 *                 type: string
 *                password:
 *                 type: string
 *                isAdmin:
 *                 type: boolean
 *                token:
 *                 type: string
 *       400:
 *         description: Invalid user data
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             message:
 *              type: string
 *       404:
 *         description: User not found
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             message:
 *              type: string
 *   get:
 *    summary: Get all users
 *    tags: [Users, Admin]
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         $ref: '#/components/schemas/User'
 *     401:
 *      description: Access Error
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 */
router.route("/").post(registerUser).get(protect, isAdmin, getUsers);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticates the user login credentials
 *     tags: [Users, Public]
 *     requestBody:
 *      description: Mandatory description body
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         required: true
 *         properties:
 *          email:
 *           type: string
 *          password:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                _id:
 *                 type: string
 *                name:
 *                 type: string
 *                email:
 *                 type: string
 *                isAdmin:
 *                 type: boolean
 *                token:
 *                 type: string
 *       401:
 *         description: Login failed
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             message:
 *              type: string
 */
router.post("/login", authUser);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Returns the user profile
 *     tags: [Users, Private]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                _id:
 *                 type: string
 *                name:
 *                 type: string
 *                email:
 *                 type: string
 *                isAdmin:
 *                 type: boolean
 *       401:
 *         description: Access error
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             message:
 *              type: string
 *       404:
 *         description: User not found
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             message:
 *              type: string
 *   put:
 *    summary: Updating the user profile
 *    tags: [Users, Private]
 *    security:
 *     - bearerAuth: []
 *    requestBody:
 *     description: Profile information sent for updating
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *         email:
 *          type: string
 *         password:
 *          type: string
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *          name:
 *           type: string
 *          email:
 *           type: string
 *          isAdmin:
 *           type: boolean
 *          token:
 *           type: string
 *     401:
 *      description: Access Error
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 */
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Returns a profile without their password by the user Id
 *     tags: [Users, Admin]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *         type: string
 *        required: false
 *        description: The unique id given to a user
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/UserNoPassword'
 *       404:
 *         description: Not Found
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Deletes a user by the user Id
 *     tags: [Users, Admin]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *         type: string
 *        required: false
 *        description: The unique id given to the user profile
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
 *     summary: Updates a user by their product Id
 *     tags: [Users, Admin]
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
 *          email:
 *           type: string
 *          isAdmin:
 *           type: boolean
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                _id:
 *                 type: string
 *                name:
 *                 type: string
 *                email:
 *                 type: string
 *                isAdmin:
 *                 type: boolean
 *       401:
 *         description: Not Found
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Not Found
 *         $ref: '#/components/responses/NotFoundError'
 */
router
	.route("/:id")
	.delete(protect, isAdmin, deleteUser)
	.get(protect, isAdmin, getUserById)
	.put(protect, isAdmin, updateUser);

export default router;
