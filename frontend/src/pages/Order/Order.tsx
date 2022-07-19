import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useMatch, useNavigate, useSearch } from "@tanstack/react-location";
import { Helmet } from "react-helmet-async";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { FaStripe } from "react-icons/fa";

import Header from "../../components/Header";
import OrderSummary from "../../components/OrderSummary";
import OrderItemList from "../../components/OrderItemList";
import Button from "../../components/Button";

import { LocationGenerics } from "../../App";
import { useAuth } from "../../context/AuthContext";
import { getOrderById, MakePayPalPaymentDTO, payOrder } from "../../api/order";
import { getPaypalClientId } from "../../api/config";
import { Order } from "../../types/Order";
import { formatShortDate, formatTextDate } from "../../utils/format";
import { makeUrl, ResponseParsed } from "../../api/base";
import { adminOrderDelivered, AdminOrderDeliveredDTO } from "../../api/admin";
import { useCart } from "../../context/CartContext";

const OrderPage = () => {
	const {
		params: { orderId },
	} = useMatch<LocationGenerics>();
	const queryFrom = useSearch<LocationGenerics>().redirect;
	const fromQ = queryFrom || "/";

	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const token = user?.token ?? "";

	const { clearItems: clearCartItems } = useCart();

	const [mounted, setMounted] = useState(false);
	const [paypalLoadingPending, setPaypalLoadingPending] = useState(true);
	const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

	const orderQuery = useQuery<ResponseParsed<Order>, any>(["orders", orderId], () => getOrderById({ token, orderId }), {
		onError: () => {
			navigate({ to: "/account" });
		},
		enabled: mounted,
	});

	const { data: paypalClientId } = useQuery<string, any>(["config", "paypal"], getPaypalClientId, {
		onSuccess: () => {
			setPaypalLoadingPending(false);
		},
		enabled: orderQuery?.data?.data?.paymentMethod?.toLowerCase()?.trim() === "paypal" ? true : false,
	});

	const { mutate: storePayment } = useMutation<Order, any, MakePayPalPaymentDTO>(payOrder, {
		onSuccess: () => {
			queryClient.invalidateQueries(["orders", orderId]);
			queryClient.invalidateQueries(["orders"]);
		},
	});

	const { mutate: markDelivered, isLoading: isMarkingDelivered } = useMutation<
		ResponseParsed<Order>,
		any,
		AdminOrderDeliveredDTO
	>(adminOrderDelivered, {
		onSuccess: () => {
			queryClient.invalidateQueries(["orders", orderId]);
			queryClient.invalidateQueries(["orders"]);
		},
	});

	const orderItems = useMemo(() => {
		if (!orderQuery.data || !orderQuery.data.data.orderItems) {
			return [];
		}
		return orderQuery.data?.data.orderItems?.map((item, idx) => ({
			identifier: idx,
			id: item.product,
			name: item.name,
			image: item.image,
			price: item.price,
			countInStock: 0,
			qty: item.qty,
		}));
	}, [orderQuery.data]);

	useEffect(() => {
		if (fromQ === "checkout") {
			clearCartItems();
		}
		setMounted(true);
	}, [clearCartItems, fromQ]);

	if (orderId.trim() === "/" || orderId.trim() === "") {
		return <Navigate to='/' replace />;
	}

	return (
		<React.Fragment>
			<Header />
			<Helmet>
				<title>Nextshop | Order - {orderId && `${orderId}`}</title>
			</Helmet>
			<main>
				<section className='py-4'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='pt-5 md:pt-10 space-y-2 sm:flex sm:items-baseline sm:justify-between sm:space-y-0'>
							<div className='flex sm:items-baseline sm:space-x-4'>
								<h1 className='text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl truncate'>
									Order #{orderQuery.data?.data._id}
								</h1>
							</div>
							<p className='text-sm text-gray-600'>
								Order placed&nbsp;
								{orderQuery.data && (
									<time dateTime={orderQuery.data?.data.createdAt} className='font-medium text-gray-900'>
										{formatTextDate(orderQuery.data?.data.createdAt)}
									</time>
								)}
							</p>
						</div>
						<div className='pt-5 grid grid-cols-1 gap-10 md:grid-cols-12'>
							<div className='md:col-span-8'>
								<h2 className='text-lg font-medium text-gray-900 pt-5 pb-5'>
									{orderItems.length > 1 ? "Items" : "Item"}&nbsp;ordered
								</h2>
								<div className=''>{orderQuery.data && <OrderItemList items={orderItems} />}</div>
							</div>
							<div className='md:col-span-4'>
								<div className='flex flex-col gap-4'>
									{orderQuery.data && (
										<div className='bg-gray-50 rounded-md py-6 px-4 sm:px-6'>
											<h2 className='text-lg font-medium text-gray-900 pb-5'>Order status</h2>
											<dl className='grid grid-cols-1 gap-6 text-sm md:gap-x-8 lg:col-span-5'>
												<span className='font-medium text-gray-900'>Payment &amp; Delivery</span>
												<div className='space-y-1'>
													<div className='flex flex-col sm:flex-row items-start justify-between'>
														<dt className='text-gray-500'>Payment gateway</dt>
														<dd className='font-medium text-left sm:text-right text-indigo-600'>
															{orderQuery.data.data.paymentMethod}
														</dd>
													</div>
													<div className='flex flex-col sm:flex-row items-start justify-between'>
														<dt className='text-gray-500'>Payment status</dt>
														<dd
															className={`font-medium text-left sm:text-right ${
																orderQuery.data?.data.isPaid ? "text-indigo-600" : "text-red-600"
															}`}
														>
															{orderQuery.data?.data.isPaid ? "Paid" : "Not completed"}
														</dd>
													</div>
													<div className='flex flex-col sm:flex-row items-start justify-between'>
														<dt className='text-gray-500'>Delivery status</dt>
														<dd
															className={`font-medium text-left sm:text-right ${
																orderQuery.data?.data.isDeliver ? "text-indigo-600" : "text-red-600"
															}`}
														>
															<span className='inline-block sm:block'>
																{orderQuery.data?.data.isDeliver ? "Delivered" : "Not delivered"}
															</span>
															{orderQuery.data?.data.deliveredAt && (
																<span className='inline-block sm:block'>
																	&nbsp;{`on ${formatShortDate(orderQuery.data?.data.deliveredAt)}`}
																</span>
															)}
														</dd>
													</div>
												</div>
												<div>
													<dt className='font-medium text-gray-900'>Shipping Address</dt>
													<dd className='mt-3 text-gray-500'>
														<span className='block'>{orderQuery.data?.data.user.name}</span>
														<span className='block'>{orderQuery.data?.data.shippingAddress?.address}</span>
														<span className='block'>
															{orderQuery.data?.data.shippingAddress?.city},{" "}
															{orderQuery.data?.data.shippingAddress?.postalCode}
														</span>
														<span className='block'>{orderQuery.data?.data.shippingAddress?.country}</span>
													</dd>
												</div>
												<div>
													<dt className='font-medium text-gray-900'>Contact</dt>
													<dd className='mt-3 text-gray-500'>
														<span className='block'>Email: {orderQuery.data?.data.user?.email}</span>
													</dd>
												</div>
											</dl>
										</div>
									)}
									{orderQuery.data && (
										<OrderSummary
											subtotalPrice={orderQuery.data.data.itemsPrice}
											shippingPrice={orderQuery.data.data.shippingPrice}
											taxPrice={orderQuery.data.data.taxPrice}
											totalPrice={orderQuery.data.data.totalPrice}
										>
											{orderQuery.data?.data?.isPaid === false &&
												orderQuery.data?.data?.paymentMethod?.toLowerCase() === "paypal" &&
												paypalLoadingPending === false && (
													<PayPalScriptProvider
														options={{
															"client-id": paypalClientId ?? "",
															currency: "USD",
														}}
													>
														<PayPalButtons
															fundingSource='paypal'
															style={{ color: "blue" }}
															createOrder={async (_, actions) => {
																return actions.order
																	.create({
																		intent: "CAPTURE",
																		application_context: {
																			brand_name: "Nextshop",
																			landing_page: "BILLING",
																		},
																		purchase_units: [
																			{
																				amount: {
																					currency_code: "USD",
																					value: orderQuery.data.data.totalPrice.toFixed(2),
																				},
																			},
																		],
																	})
																	.then((orderId) => orderId);
															}}
															onApprove={async (_, actions) => {
																return actions?.order?.capture().then((paymentResult) => {
																	storePayment({
																		token,
																		orderId,
																		paymentResult: {
																			...paymentResult,
																			email_address:
																				paymentResult.payer.email_address ?? orderQuery.data.data.user.email,
																		},
																	});
																});
															}}
															onError={(err) => {
																console.log("Payment error", err);
																alert("Payment failed due to an unexpected error. Please try again.");
															}}
														/>
													</PayPalScriptProvider>
												)}
											{orderQuery?.data?.data?.isPaid === false &&
												orderQuery?.data?.data?.paymentMethod?.toLowerCase() === "stripe" && (
													<form
														action={makeUrl(`/orders/${orderId}/checkout-stripe-with-follow`, {}).toString()}
														method='POST'
													>
														<input type='hidden' name='order_id' value={orderId} readOnly />
														<input type='hidden' name='origin_url' value={`${window.location.href}`} readOnly />
														<Button
															type='submit'
															size='sm'
															fullWidth
															loading={isPaymentProcessing}
															disabled={isPaymentProcessing}
															onClick={() => {
																setIsPaymentProcessing(true);
															}}
														>
															<div className='text-center flex gap-2 justify-center items-center'>
																<span>Pay via</span>
																<FaStripe className='text-5xl' />
															</div>
														</Button>
													</form>
												)}
											{user?.isAdmin &&
												orderQuery.data?.data?.isPaid &&
												user?.isAdmin &&
												orderQuery.data?.data?.isDeliver === false && (
													<Button
														size='xl'
														fullWidth
														onClick={() => {
															markDelivered({ token, orderId });
														}}
														disabled={isMarkingDelivered}
													>
														Mark as delivered
													</Button>
												)}
										</OrderSummary>
									)}
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</React.Fragment>
	);
};

export default OrderPage;
