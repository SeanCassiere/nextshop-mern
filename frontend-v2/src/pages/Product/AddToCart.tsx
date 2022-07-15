import React from "react";
import FormSelect from "../../components/FormSelect";
import { Product } from "../../types/Product";

const AddToCart: React.FC<{ product: Product }> = ({ product }) => {
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
						<FormSelect
							defaultValue={quantity}
							onChange={(e) => {
								setQuantity(Number(e.target.value));
							}}
						>
							{[...Array(product.countInStock).keys()].map((x) => (
								<option key={x + 1} value={x + 1}>
									{x + 1}
								</option>
							))}
						</FormSelect>
					</div>
				</div>
			)}
			<div className='p-4 grid grid-cols-1 border border-t-0 border-gray-300 dark:border-gray-700'>
				<button
					className='block w-full p-3 text-md font-semibold text-white bg-gray-800 disabled:bg-gray-500 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
					type='button'
					disabled={product.countInStock > 0 ? false : true}
					onClick={() => {
						console.log("adding to cart", product);
					}}
				>
					Add to cart
				</button>
			</div>
		</React.Fragment>
	);
};

export default AddToCart;
