import React from "react";
import { useNavigate } from "@tanstack/react-location";

import Select from "../../components/Select";
import Button from "../../components/Button";
import { useCart } from "../../context/CartContext";
import { Product } from "../../types/Product";

const AddToCart: React.FC<{ product: Product }> = ({ product }) => {
	const navigate = useNavigate();
	const { addToCart } = useCart();

	const [quantity, setQuantity] = React.useState(1);

	return (
		<React.Fragment>
			<div className='p-4 grid grid-cols-2 border border-gray-300 dark:border-gray-700'>
				<div>Price</div>
				<div>${Number(product.price).toFixed(2)}</div>
			</div>
			<div className='p-4 grid grid-cols-2 border border-t-0 border-gray-300 dark:border-gray-700'>
				<div>Status</div>
				<div>{product.countInStock > 0 ? "In-stock" : "Out-of-stock"}</div>
			</div>
			{product.countInStock > 0 && (
				<div className='p-4 grid grid-cols-2 border border-t-0 border-gray-300 dark:border-gray-700'>
					<div>Quantity</div>
					<div>
						<Select
							defaultValue={quantity}
							onChange={(e) => {
								setQuantity(Number(e.target.value));
							}}
							selectSize='sm'
						>
							{[...Array(product.countInStock).keys()].map((x) => (
								<option key={x + 1} value={x + 1}>
									{x + 1}
								</option>
							))}
						</Select>
					</div>
				</div>
			)}
			<div className='p-4 grid grid-cols-1 border border-t-0 border-gray-300 dark:border-gray-700'>
				<Button
					type='button'
					size='lg'
					disabled={product.countInStock > 0 ? false : true}
					onClick={() => {
						addToCart({
							id: product._id,
							name: product.name,
							image: product.image,
							price: product.price,
							qty: quantity,
							countInStock: product.countInStock,
						});
						navigate({ to: "/cart" });
					}}
				>
					Add to cart
				</Button>
			</div>
		</React.Fragment>
	);
};

export default AddToCart;
