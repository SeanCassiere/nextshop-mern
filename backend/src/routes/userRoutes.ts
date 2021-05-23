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
 *      description: The Id of the product
 *     user:
 *      type: string
 *      description: The user who created the product
 *     isActive:
 *      type: boolean
 *      description: This controls the availability of the product to the public
 *     createdAt:
 *      type: string
 *      description: The created at date
 *     updatedAt:
 *      type: string
 *      description: The created at date
 *    example:
 *     _id: 5fc3c9f5b6003a3dc065c574
 *     user: 5fc2b7d1b9b6255e64167bda
 *     isActive: true
 *     createdAt: 2020-11-29T16:19:01.560+00:00
 *     updatedAt: 2020-11-29T16:19:01.560+00:00
 */

router.route("/").post(registerUser).get(protect, isAdmin, getUsers);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Returns the user login status
 *     tags: [Users]
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
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router
	.route("/:id")
	.delete(protect, isAdmin, deleteUser)
	.get(protect, isAdmin, getUserById)
	.put(protect, isAdmin, updateUser);

export default router;
