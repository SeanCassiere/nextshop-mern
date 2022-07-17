import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Order from "../models/orderModel";

import { CustomRequest, IncomingOrderInterface } from "../utils/CustomInterfaces";

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req: CustomRequest<IncomingOrderInterface>, res: Response) => {
	const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

	if (orderItems && orderItems.length === 0) {
		res.status(404);
		throw new Error("No Order Items");
	} else {
		const order = new Order({
			orderItems,
			user: req.user._id,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
		});

		const createdOrder = await order.save();

		res.status(201).json(createdOrder);
	}
});

// @desc Get Order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req: Request, res: Response) => {
	const order = await Order.findById(req.params.id).populate("user", "name email");
	if (order) {
		let itemsPrice = order.itemsPrice;
		if (itemsPrice === 0) {
			itemsPrice = order.orderItems.reduce((acc, cur) => acc + cur.price * cur.qty, 0);
			order.itemsPrice = itemsPrice;
			await order.save();
		}
		res.json(order);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		order.isPaid = true;
		order.paidAt = Date.now();
		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.update_time,
			email_address: req.body.payer.email_address,
		};

		const updatedOrder = await order.save();
		res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private
const updateOrderToDelivered = asyncHandler(async (req: Request, res: Response) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		order.isDeliver = true;
		order.deliveredAt = Date.now();

		const updatedOrder = await order.save();
		res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
	const orders = await Order.find({ user: req.user._id }).sort({ createdAt: "desc" });
	res.json(orders);
});

// @desc Get all orders
// @route GET /api/orders
// @access Private
const getAllOrders = asyncHandler(async (_, res) => {
	const orders = await Order.find({}).populate("user", "id name");
	res.json(orders);
});

export { addOrderItems, getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrders, getAllOrders };
