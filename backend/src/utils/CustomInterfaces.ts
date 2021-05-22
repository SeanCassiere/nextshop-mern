import { Request } from "express";
import { OrderItemInter, OrderShippingAddressInter } from "../models/orderModel";

export interface CustomRequest<T> extends Request {
	body: T;
}

export interface TokenInterface {
	id: string;
}

export interface IncomingOrderInterface {
	orderItems: OrderItemInter[];
	shippingAddress: OrderShippingAddressInter;
	paymentMethod: string;
	itemsPrice: number;
	taxPrice: number;
	shippingPrice: number;
	totalPrice: number;
}
