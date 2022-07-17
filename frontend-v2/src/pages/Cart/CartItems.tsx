import { Link } from "@tanstack/react-location";
import React from "react";
import Alert from "../../components/Alert";
import { ContextCartItem, useCart } from "../../context/CartContext";

const CartItems: React.FC<{ items: ContextCartItem[] }> = ({ items }) => {
	const { removeFromCart } = useCart();

	if (items.length === 0) {
		return (
			<div>
				<Alert label='Start shopping!'>
					Your cart is empty. Head over to the{" "}
					<Link to='/' className='underline'>
						store
					</Link>{" "}
					to add items to your cart.
				</Alert>
			</div>
		);
	}
	return (
		<div className='flow-root'>
			<ul className='divide-y divide-gray-200'>
				{items.map((product) => (
					<li key={`cart-item-${product.identifier}-${product.id}`} className='flex py-4'>
						<div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200'>
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
									<p className='ml-4'>${product.price}</p>
								</div>
								{/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
							</div>
							<div className='flex flex-1 items-end justify-between text-sm'>
								<p className='text-gray-500'>Qty {product.qty}</p>

								<div className='flex'>
									<button
										type='button'
										onClick={() => removeFromCart(product.identifier)}
										className='font-medium text-indigo-800  hover:text-indigo-600'
									>
										Remove
									</button>
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default React.memo(CartItems);
