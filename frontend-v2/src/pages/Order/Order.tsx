import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Navigate, useMatch, useNavigate } from "@tanstack/react-location";
import { Helmet } from "react-helmet-async";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { LocationGenerics } from "../../App";
import { useAuth } from "../../context/AuthContext";
import { getOrderById, MakePayPalPaymentDTO, payOrder } from "../../api/order";
import { getPaypalClientId } from "../../api/config";
import { Order } from "../../types/Order";

import Header from "../../components/Header";
import OrderSummary from "../../components/OrderSummary";
import OrderItemList from "../../components/OrderItemList";
import { formatTextDate } from "../../utils/format";

const OrderPage = () => {
	const {
		params: { orderId },
	} = useMatch<LocationGenerics>();

	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const token = user?.token ?? "";

	const [paypalLoadingPending, setPaypalLoadingPending] = useState(true);

	const { data: paypalClientId } = useQuery<string, any>(["config", "paypal"], getPaypalClientId, {
		onSuccess: () => {
			setPaypalLoadingPending(false);
		},
	});

	const { mutate: storePayment } = useMutation<Order, any, MakePayPalPaymentDTO>(payOrder, {
		onSuccess: () => {
			queryClient.invalidateQueries(["orders", orderId]);
			queryClient.invalidateQueries(["orders"]);
		},
	});

	const orderQuery = useQuery<Order, any>(["orders", orderId], () => getOrderById({ token, orderId }), {
		onError: () => {
			navigate({ to: "/account" });
		},
	});

	const orderItems = useMemo(() => {
		if (!orderQuery.data || !orderQuery.data.orderItems) {
			return [];
		}
		return orderQuery.data?.orderItems?.map((item, idx) => ({
			identifier: idx,
			id: item.product,
			name: item.name,
			image: item.image,
			price: item.price,
			countInStock: 0,
			qty: item.qty,
		}));
	}, [orderQuery.data]);

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
									Order #{orderQuery.data?._id}
								</h1>
							</div>
							<p className='text-sm text-gray-600'>
								Order placed&nbsp;
								{orderQuery.data && (
									<time dateTime={orderQuery.data?.createdAt} className='font-medium text-gray-900'>
										{formatTextDate(orderQuery.data?.createdAt)}
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
												<div>
													<dt className='font-medium text-gray-900'>Payment &amp; Delivery</dt>
													<dd className='mt-3 text-gray-500'>
														<span className='block'>
															Payment gateway:&nbsp;
															<span className='font-medium text-indigo-600'>{orderQuery.data?.paymentMethod}</span>
														</span>
														<span className='block'>
															Payment status:&nbsp;
															<span
																className={`font-medium ${
																	orderQuery.data?.isPaid ? "text-indigo-600" : "text-red-600"
																}`}
															>
																{orderQuery.data?.isPaid ? "Paid" : "Not completed"}
															</span>
														</span>
														<span className='block'>
															Delivery status:&nbsp;
															<span
																className={`font-medium ${
																	orderQuery.data?.isDeliver ? "text-indigo-600" : "text-red-600"
																}`}
															>
																{orderQuery.data?.isDeliver ? "Delivered" : "Not delivered"}
															</span>
															{orderQuery.data?.deliveredAt && ` on ${orderQuery.data?.deliveredAt.substring(0, 10)}`}
														</span>
													</dd>
												</div>
												<div>
													<dt className='font-medium text-gray-900'>Shipping Address</dt>
													<dd className='mt-3 text-gray-500'>
														<span className='block'>{orderQuery.data?.user.name}</span>
														<span className='block'>{orderQuery.data?.shippingAddress?.address}</span>
														<span className='block'>
															{orderQuery.data?.shippingAddress?.city}, {orderQuery.data?.shippingAddress?.postalCode}
														</span>
														<span className='block'>{orderQuery.data?.shippingAddress?.country}</span>
													</dd>
												</div>
												<div>
													<dt className='font-medium text-gray-900'>Contact</dt>
													<dd className='mt-3 text-gray-500'>
														<span className='block'>Email: {orderQuery.data?.user?.email}</span>
													</dd>
												</div>
											</dl>
										</div>
									)}
									{paypalLoadingPending === false && (
										<PayPalScriptProvider
											options={{
												"client-id": paypalClientId ?? "",
												currency: "USD",
											}}
										>
											{orderQuery.data && (
												<OrderSummary
													subtotalPrice={orderQuery.data.itemsPrice}
													shippingPrice={orderQuery.data.shippingPrice}
													taxPrice={orderQuery.data.taxPrice}
													totalPrice={orderQuery.data.totalPrice}
												>
													{orderQuery.data?.isPaid === false && (
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
																					value: orderQuery.data.totalPrice.toFixed(2),
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
																			email_address: paymentResult.payer.email_address ?? orderQuery.data.user.email,
																		},
																	});
																});
															}}
															onError={(err) => {
																console.log("Payment error", err);
																alert("Payment failed due to an unexpected error. Please try again.");
															}}
														/>
													)}
												</OrderSummary>
											)}
										</PayPalScriptProvider>
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
