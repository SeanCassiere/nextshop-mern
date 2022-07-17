import mongoose, { Schema, Document, Model } from "mongoose";
import User from "./userModel";

const orderSchema = new Schema<OrderInter, OrderModel>(
	{
		user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: User },
		orderItems: [
			{
				name: { type: String, required: true },
				qty: { type: Number, required: true },
				image: { type: String, required: true },
				price: { type: Number, required: true },
				product: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "Product",
				},
			},
		],
		shippingAddress: {
			address: { type: String, required: true },
			city: { type: String, required: true },
			postalCode: { type: String, required: true },
			country: { type: String, required: true },
		},
		paymentMethod: { type: String, required: true },
		paymentResult: {
			id: { type: String },
			status: { type: String },
			update_time: { type: String },
			email_address: { type: String },
		},
		itemsPrice: { type: Number, required: true, default: 0.0 },
		taxPrice: { type: Number, required: true, default: 0.0 },
		shippingPrice: { type: Number, required: true, default: 0.0 },
		totalPrice: { type: Number, required: true, default: 0.0 },
		isPaid: { type: Boolean, required: true, default: false },
		paidAt: { type: Date },
		isDeliver: { type: Boolean, required: true, default: false },
		deliveredAt: { type: Date },
	},
	{ timestamps: true }
);

export interface OrderItemInter {
	name: string;
	qty: number;
	image: string;
	price: number;
	product: mongoose.Schema.Types.ObjectId;
}

export interface OrderShippingAddressInter {
	address: string;
	city: string;
	postalCode: string;
	country: string;
}

export interface OrderInter {
	user: mongoose.Schema.Types.ObjectId;
	orderItems: OrderItemInter[];
	shippingAddress: OrderShippingAddressInter;
	paymentMethod: string;
	paymentResult: {
		id: string;
		status: string;
		update_time: string;
		email_address: string;
	};
	itemsPrice: number;
	taxPrice: number;
	shippingPrice: number;
	totalPrice: number;
	isPaid: boolean;
	paidAt: number;
	isDeliver: boolean;
	deliveredAt: number;
}
export interface OrderDocument extends OrderInter, Document {}
export interface OrderModel extends Model<OrderInter> {}

const Order = mongoose.model("order", orderSchema);

export default Order;
