import React, { useCallback, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate } from "@tanstack/react-location";
import { useMutation } from "react-query";
import { RadioGroup } from "@headlessui/react";
import { BsCheckCircleFill } from "react-icons/bs";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { AuthUser } from "../../types/User";
import { CreateOrderDTO, placeUserOrder } from "../../api/order";
import { Order } from "../../types/Order";
import { classNames } from "../../utils/tw";

import Header from "../../components/Header";
import Input from "../../components/Input";
import Button from "../../components/Button";
import OrderItemList from "../../components/OrderItemList";
import OrderSummary from "../../components/OrderSummary";
import { ResponseParsed } from "../../api/base";

type StepOption = "shipping-address" | "payment-selection" | "confirmation";

const Checkout = () => {
	const { items } = useCart();
	const { user } = useAuth();

	const [currentStep, setCurrentStep] = useState<StepOption>("shipping-address");

	const isStepActive = useCallback(
		(step: StepOption) => {
			if (step === "shipping-address") {
				return true;
			} else if (step === "payment-selection") {
				if (currentStep !== "shipping-address") return true;
				return false;
			} else if (step === "confirmation") {
				if (currentStep !== "shipping-address" && currentStep !== "payment-selection") return true;
				return false;
			} else {
				return false;
			}
		},
		[currentStep]
	);

	const changeStep = useCallback((step: StepOption) => {
		setCurrentStep(step);
	}, []);

	if (items.length === 0) {
		return <Navigate to='/' />;
	}

	if (!user) {
		return <Navigate to='/login' search={{ redirect: "/checkout" }} />;
	}

	return (
		<React.Fragment>
			<Header />
			<Helmet>
				<title>Checkout | Nextshop</title>
			</Helmet>
			<main>
				<section className='py-4'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<h2 className='text-3xl mb-4 md:pt-10 font-bold tracking-tight text-gray-900'>Checkout</h2>
						<div className='flex flex-col md:flex-row gap-5 pb-5'>
							<div>
								<button
									className={`
									font-semibold ${isStepActive("shipping-address") ? "text-indigo-600" : "text-indigo-300 cursor-default"} duration-150
									`}
									onClick={() => {
										setCurrentStep("shipping-address");
									}}
									disabled={!isStepActive("shipping-address")}
								>
									Shipping
								</button>
							</div>
							<div>
								<button
									className={`
								font-semibold ${isStepActive("payment-selection") ? "text-indigo-600" : "text-indigo-300 cursor-default"} duration-150
								`}
									onClick={() => {
										setCurrentStep("payment-selection");
									}}
									disabled={!isStepActive("payment-selection")}
								>
									Payment
								</button>
							</div>
							<div>
								<button
									className={`
								font-semibold ${isStepActive("confirmation") ? "text-indigo-600" : "text-indigo-300 cursor-default"} duration-150
								`}
									onClick={() => {
										setCurrentStep("confirmation");
									}}
									disabled={!isStepActive("confirmation")}
								>
									Confirmation
								</button>
							</div>
						</div>
						<div className='py-3 md:py-5'>
							{currentStep === "shipping-address" && (
								<div className='max-w-xl'>
									<ShippingForm changeStep={changeStep} />
								</div>
							)}
							{currentStep === "payment-selection" && (
								<div className='max-w-xl'>
									<PaymentSelectionForm changeStep={changeStep} />
								</div>
							)}
							{currentStep === "confirmation" && (
								<div className='w-full'>
									<PlaceOrderForm changeStep={changeStep} user={user} />
								</div>
							)}
						</div>
					</div>
				</section>
			</main>
		</React.Fragment>
	);
};

type CommonSubFormProps = {
	changeStep: (step: StepOption) => void;
};

const ShippingForm: React.FC<CommonSubFormProps> = ({ changeStep }) => {
	const { shippingAddress, setAddress } = useCart();

	const [formData, setFormData] = useState(shippingAddress);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (
			e.target.name === "address" ||
			e.target.name === "city" ||
			e.target.name === "postalCode" ||
			e.target.name === "country"
		) {
			setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		}
	};

	return (
		<form
			className='flex flex-col gap-4'
			onSubmit={(e) => {
				e.preventDefault();
				setAddress(formData);
				changeStep("payment-selection");
			}}
		>
			<h2 className='text-xl font-medium tracking-tight text-gray-700'>Enter your shipping address</h2>
			<div className='flex flex-col gap-3'>
				<Input
					type='text'
					label='Address'
					name='address'
					placeholder='Address'
					value={formData.address}
					onChange={handleChange}
					required
				/>
				<Input
					type='text'
					label='City'
					name='city'
					placeholder='City'
					value={formData.city}
					onChange={handleChange}
					required
				/>
				<Input
					type='text'
					label='Postal code'
					name='postalCode'
					placeholder='Postal Code'
					value={formData.postalCode}
					onChange={handleChange}
					required
				/>
				<Input
					type='text'
					label='Country'
					name='country'
					placeholder='Country'
					value={formData.country}
					onChange={handleChange}
					required
				/>
			</div>
			<div>
				<Button type='submit' size='sm'>
					Continue
				</Button>
			</div>
		</form>
	);
};

const PaymentSelectionForm: React.FC<CommonSubFormProps> = ({ changeStep }) => {
	const { setPaymentMethod, paymentMethod, paymentMethods } = useCart();
	return (
		<form
			className='flex flex-col gap-4'
			onSubmit={(e) => {
				e.preventDefault();
				changeStep("confirmation");
			}}
		>
			<h2 className='text-xl font-medium tracking-tight text-gray-700'>Choose your payment method</h2>
			<RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
				<RadioGroup.Label className='text-md'>Available payment method(s)</RadioGroup.Label>
				<div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
					{paymentMethods.map((paymentProvider) => (
						<RadioGroup.Option
							key={paymentProvider}
							value={paymentProvider}
							className={({ checked, active }) =>
								classNames(
									checked ? "border-transparent" : "border-gray-300",
									active ? "ring-2 ring-indigo-500" : "",
									"relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none"
								)
							}
						>
							{({ checked, active }) => (
								<>
									<div className='flex-1 flex'>
										<div className='flex flex-col'>
											<RadioGroup.Label as='span' className='block text-sm font-medium text-gray-900'>
												{paymentProvider}
											</RadioGroup.Label>
											<RadioGroup.Description as='span' className='mt-1 flex items-center text-sm text-gray-500'>
												{paymentProvider === "PayPal" && "PayPal account or credit card"}
											</RadioGroup.Description>
										</div>
									</div>
									{checked ? <BsCheckCircleFill className='h-5 w-5 text-indigo-600' aria-hidden='true' /> : null}
									<div
										className={classNames(
											active ? "border" : "border-2",
											checked ? "border-indigo-500" : "border-transparent",
											"absolute -inset-px rounded-lg pointer-events-none"
										)}
										aria-hidden='true'
									/>
								</>
							)}
						</RadioGroup.Option>
					))}
				</div>
			</RadioGroup>
			<div>
				<Button type='submit' size='sm'>
					Continue
				</Button>
			</div>
		</form>
	);
};

const PlaceOrderForm: React.FC<{ user: AuthUser } & CommonSubFormProps> = ({ user }) => {
	const token = user?.token ?? "";
	const { itemsPrice, taxPrice, shippingPrice, totalPrice, shippingAddress, paymentMethod, items, clearItems } =
		useCart();
	const navigate = useNavigate();

	const [mutationError, setMutationError] = useState<string | null>(null);

	const { mutate: placeOrder } = useMutation<ResponseParsed<Order>, any, { token: string } & CreateOrderDTO>(
		placeUserOrder,
		{
			onMutate: () => {
				setMutationError(null);
			},
			onError: (err) => {
				setMutationError(`${err}`);
			},
			onSuccess: (data) => {
				if (data?.data?._id) {
					clearItems();
					navigate({ to: `/order/${data?.data?._id}` });
				} else {
					setMutationError(`Something happened, the _id was not returned.`);
				}
			},
		}
	);

	const handlePlaceOrder = useCallback(() => {
		placeOrder({
			token,
			orderItems: items.map((prod) => ({ ...prod, _id: prod.id, product: prod.id })),
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
			shippingAddress,
			paymentMethod,
		});
	}, [placeOrder, items, itemsPrice, paymentMethod, shippingAddress, shippingPrice, taxPrice, token, totalPrice]);

	return (
		<div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
			<div className='md:col-span-8'>
				<div className='flex flex-col gap-4 pb-5 border-t border-b border-gray-100 divide divide-y divide-gray-100'>
					<div className='pt-3'>
						<div className='px-2'>
							<h2 className='text-xl pb-3 font-medium tracking-tight text-gray-700'>Shipping</h2>
						</div>
						<div className='px-4'>
							<p className='text-sm'>
								{shippingAddress.address},{shippingAddress.postalCode}, {shippingAddress.country}
							</p>
							<p className='text-sm'>{shippingAddress.city},</p>
							<p className='text-sm'>{shippingAddress.postalCode},</p>
							<p className='text-sm'>{shippingAddress.country}</p>
						</div>
					</div>
					<div className='pt-3'>
						<div className='px-2'>
							<h2 className='text-xl pb-3 font-medium tracking-tight text-gray-700'>Payment</h2>
						</div>
						<div className='px-4'>
							<p className='text-sm'>{paymentMethod}</p>
						</div>
					</div>
					<div className='pt-3'>
						<div className='px-2'>
							<h2 className='text-xl pb-3 font-medium tracking-tight text-gray-700'>Items</h2>
						</div>
						<div className='px-4'>
							<OrderItemList items={items} removeItem />
						</div>
					</div>
				</div>
			</div>
			<div className='md:col-span-4'>
				<div className='sticky top-[4.5rem]'>
					<OrderSummary
						error={mutationError ?? undefined}
						subtotalPrice={itemsPrice}
						shippingPrice={shippingPrice}
						taxPrice={taxPrice}
						totalPrice={totalPrice}
						actionButtonText='Place order'
						actionButtonOnClick={handlePlaceOrder}
					/>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
