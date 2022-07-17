import React from "react";
import { Link, useLoadRoute } from "@tanstack/react-location";
import { Menu, Transition } from "@headlessui/react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { RiCloseCircleFill } from "react-icons/ri";

import { Order } from "../../types/Order";
import { classNames } from "../../utils/tw";

const OrderHistoryItem: React.FC<{ order: Order }> = ({ order }) => {
	const loadRoute = useLoadRoute();

	return (
		<div className='bg-white border-t border-b border-gray-200 shadow-sm sm:rounded-lg sm:border'>
			<h3 className='sr-only'>
				Order placed on <time dateTime={order.createdAt}>{order.createdAt}</time>
			</h3>
			<div className='grid items-center p-4 border-b border-gray-200 sm:p-6 sm:grid-cols-4 sm:gap-x-6'>
				<dl className='grid grid-cols-2 col-span-4 gap-3 text-sm sm:col-span-3 sm:grid-cols-4'>
					<div className='col-span-2 lg:col-span-2'>
						<dt className='font-medium text-gray-900'>Order number</dt>
						<dd className='mt-1 text-gray-500'>{order._id}</dd>
					</div>
					<div className='hidden sm:block lg:col-span-1'>
						<dt className='font-medium text-gray-900'>Date placed</dt>
						<dd className='mt-1 text-gray-500'>
							<time dateTime={order.createdAt}>{order.createdAt.substring(0, 10)}</time>
						</dd>
					</div>
					<div className='col-span-1 lg:col-span-1'>
						<dt className='font-medium text-gray-900'>Total amount</dt>
						<dd className='mt-1 font-medium text-gray-900'>${order.totalPrice}</dd>
					</div>
					<Menu as='div' className='col-span-1 relative flex justify-end lg:hidden'>
						<div className='flex items-center'>
							<Menu.Button className='-m-2 p-2 flex items-center text-gray-400 hover:text-gray-500'>
								<span className='sr-only'>Options for order {order._id}</span>
								<BiDotsVerticalRounded className='w-6 h-6' aria-hidden='true' />
							</Menu.Button>
						</div>

						<Transition
							as={React.Fragment}
							enter='transition ease-out duration-100'
							enterFrom='transform opacity-0 scale-95'
							enterTo='transform opacity-100 scale-100'
							leave='transition ease-in duration-75'
							leaveFrom='transform opacity-100 scale-100'
							leaveTo='transform opacity-0 scale-95'
						>
							<Menu.Items className='origin-bottom-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
								<div className='py-1'>
									<Menu.Item>
										{({ active }) => (
											<Link
												onMouseEnter={() => {
													loadRoute({ to: `/order/${order._id}` });
												}}
												to={`/order/${order._id}`}
												className={classNames(
													active ? "bg-gray-100 text-gray-900" : "text-gray-700",
													"block px-4 py-2 text-sm"
												)}
											>
												View
											</Link>
										)}
									</Menu.Item>
								</div>
							</Menu.Items>
						</Transition>
					</Menu>
				</dl>

				<div className='hidden lg:col-span-1 lg:flex lg:items-center lg:justify-end lg:space-x-4'>
					<Link
						onMouseEnter={() => {
							loadRoute({ to: `/order/${order._id}` });
						}}
						to={`/order/${order._id}`}
						className='flex items-center justify-center bg-white py-2 px-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
					>
						<span>View Order</span>
						<span className='sr-only'>{order._id}</span>
					</Link>
				</div>
				<div className='pt-4'>
					<div className='flex items-center'>
						{order.isPaid ? (
							<BsFillCheckCircleFill className='w-5 h-5 text-green-500' aria-hidden='true' />
						) : (
							<RiCloseCircleFill className='w-5 h-5 text-red-500' aria-hidden='true' />
						)}
						<p className='ml-2 text-sm font-medium text-gray-500'>{order.isPaid ? "Paid" : "Not paid"}</p>
					</div>
				</div>
				<div className='pt-4'>
					<div className='flex items-center'>
						{order.isDeliver ? (
							<BsFillCheckCircleFill className='w-5 h-5 text-green-500' aria-hidden='true' />
						) : (
							<RiCloseCircleFill className='w-5 h-5 text-red-500' aria-hidden='true' />
						)}
						<p className='ml-2 text-sm font-medium text-gray-500'>
							{order.isDeliver ? "Delivered" : "Not yet delivered"}
						</p>
					</div>
				</div>
			</div>

			{/*  */}
			<h4 className='sr-only'>Items</h4>
			<ul className='divide-y divide-gray-200'>
				{order.orderItems.map((product) => (
					<li
						key={product._id}
						className='p-4 sm:p-6'
						onMouseEnter={() => {
							loadRoute({ to: `/products/${product.product}` });
						}}
					>
						<div className='flex items-center sm:items-start'>
							<div className='flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden sm:w-40 sm:h-40'>
								<img src={product.image} alt={product.name} className='w-full h-full object-center object-cover' />
							</div>
							<div className='flex-1 ml-6 text-sm'>
								<div className='font-medium text-gray-900 sm:flex sm:justify-between'>
									<h5>{product.name}</h5>
									<p className='mt-2 sm:mt-0'>
										{product.qty > 1 && `${product.qty} x `}${product.price}
									</p>
								</div>
								<p className='hidden text-gray-500 sm:block sm:mt-2'>{product.name}</p>
							</div>
						</div>

						<div className='mt-6 sm:flex sm:justify-end'>
							<div className='mt-6 border-t border-gray-200 pt-4 flex items-center space-x-4 divide-x divide-gray-200 text-sm font-medium sm:mt-0 sm:ml-4 sm:border-none sm:pt-0'>
								<div className='flex-1 flex justify-center'>
									<Link
										to={`/products/${product.product}`}
										className='text-indigo-600 whitespace-nowrap hover:text-indigo-500'
									>
										View product
									</Link>
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default OrderHistoryItem;
