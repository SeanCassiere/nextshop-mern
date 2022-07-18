import React from "react";
import { Link } from "@tanstack/react-location";

import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

type OrderItem = {
	identifier: number;
	id: string;
	name: string;
	image: string;
	price: number;
	qty: number;
};

const OrderItemList: React.FC<{ items: OrderItem[]; removeItem?: true }> = ({ items, removeItem }) => {
	const { removeFromCart } = useCart();

	return (
		<div className='flow-root'>
			<ul className='divide-y divide-gray-100'>
				{items.map((product, idx) => (
					<li key={`cart-item-${idx}-${product.id}`} className='flex py-4'>
						<div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-100'>
							<Link to={`/products/${product.id}`}>
								<img src={product.image} alt={product.name} className='h-full w-full object-cover object-center' />
							</Link>
						</div>

						<div className='ml-4 flex flex-1 flex-col'>
							<div>
								<div className='flex justify-between text-base font-medium text-gray-900'>
									<h3>
										<Link to={`/products/${product.id}`}> {product.name} </Link>
									</h3>
									<div>
										<p className='ml-4'>{formatPrice(Number(product.price * product.qty))}</p>
										{product.qty > 1 && (
											<p className='ml-4 text-sm text-right text-gray-500'>{formatPrice(product.price)}</p>
										)}
									</div>
								</div>
								{/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
							</div>
							<div className='flex flex-1 items-end justify-between text-sm'>
								<p className='text-gray-500'>Qty {product.qty}</p>

								<div className='flex'>
									{removeItem && (
										<button
											type='button'
											onClick={() => removeFromCart(product.identifier)}
											className='font-medium text-indigo-800  hover:text-indigo-600'
										>
											Remove
										</button>
									)}
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default React.memo(OrderItemList);
