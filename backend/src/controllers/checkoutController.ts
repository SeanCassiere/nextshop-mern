import { Response } from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel";

import stripe from "../config/stripe";
import { CustomRequest } from "../utils/CustomInterfaces";

export async function checkAndUpdateOrdersForStripe(orders: any[]) {
	for (const order of orders) {
		if (
			order.paymentMethod.trim().toLowerCase() === "stripe" &&
			order.paymentResult &&
			order.paymentResult.status === "IN_COMPLETE"
		) {
			try {
				const session = await stripe.checkout.sessions.retrieve(order.paymentResult.id);
				if (session) {
					if (session.payment_status === "paid") {
						order.isPaid = true;
						order.paidAt = Date.now();
						order.paymentResult.id =
							typeof session.payment_intent === "string"
								? session.payment_intent
								: session.payment_intent?.id || order.paymentResult.id;
						order.paymentResult.status = "PAID";
						await order.save();
					} else if (Date.now() > session.expires_at) {
						order.paymentResult.status = "EXPIRED";
						await order.save();
					}
				}
			} catch (error) {
				console.log(`something went wrong - checkAndUpdateOrdersForStripe Fn - Order ID ${order._id}`, error);
			}
		}
	}
}

/**
 * @desc Create a stripe checkout session and redirect to the session. Done using a standard HTML form submit.
 * @route POST /api/:orderId/orders/checkout-stripe-with-follow
 * @access Private
 */
export const checkoutStripeWithFollow = asyncHandler(
	async (req: CustomRequest<{ order_id: string; origin_url: string }>, res: Response) => {
		const origin = req.body?.origin_url || "http://localhost:3000";
		const orderId = req.body?.order_id || req.params.id;
		const order = await Order.findById(orderId).populate("user", "id name email");

		if (!order) {
			res.status(404);
			throw new Error("Order not found");
		}

		const session = await stripe.checkout.sessions.create({
			line_items: [
				...order.orderItems.map((item) => ({
					price_data: {
						currency: "usd",
						product_data: {
							name: item.name,
						},
						unit_amount: item.price * 100,
					},
					quantity: item.qty,
				})),
				{
					price_data: {
						currency: "usd",
						product_data: {
							name: "Tax",
						},
						unit_amount: order.taxPrice * 100,
					},
					quantity: 1,
				},
				{
					price_data: {
						currency: "usd",
						product_data: {
							name: "Shipping",
						},
						unit_amount: order.shippingPrice * 100,
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${origin}?stripe=payment-success`,
			cancel_url: `${origin}`,
			customer_email: (order as unknown as any).user.email,
			payment_method_types: ["card"],
		});

		if (!session || !session.url || !session.id) {
			res.status(500);
			throw new Error("Error generating checkout session");
		}

		order.paymentResult = {
			id: session.id,
			status: "IN_COMPLETE",
			update_time: new Date().toUTCString(),
			email_address: (order as unknown as any).user.email,
		};
		await order.save();

		res.redirect(303, session.url);
	}
);
