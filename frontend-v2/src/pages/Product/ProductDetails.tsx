import React, { useEffect } from "react";
import { useNavigate } from "@tanstack/react-location";

import ProductRating from "../../components/ProductRating";
import { useCart } from "../../context/CartContext";
import { Product } from "../../types/Product";
import Select from "../../components/Select";
import Button from "../../components/Button";

const ProductDetails: React.FC<{ product: Product }> = ({ product }) => {
	const navigate = useNavigate();
	const { addToCart } = useCart();
	const [quantity, setQuantity] = React.useState(1);

	useEffect(() => {
		if (product?.countInStock === 0) {
			setQuantity(0);
		}
	}, [product?.countInStock]);

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 py-2 gap-2'>
			<div className='pr-0 md:pr-2 rounded-lg'>
				<img src={product?.image} alt={product.name} className='object-cover' />
			</div>
			<div className=''>
				<div className='flex flex-col px-0 md:px-3'>
					<h2 className='text-4xl md:text-5xl pb-3 font-bold tracking-tight text-gray-900'>{product.name}</h2>
					<div>
						<span className='text-3xl font-medium text-gray-700'>${Number(product.price).toFixed(2)}</span>
					</div>
					<div className='py-5 text-md text-gray-600'>
						<p>{product.description}</p>
					</div>
					<div className=''>
						<ProductRating rating={product.rating} text={`${product.numReviews} reviews`} />
					</div>
					<div className='pt-5 flex flex-col-reverse md:flex-row items-center gap-4 md:gap-2'>
						<Button
							type='button'
							size='lg'
							disabled={product.countInStock > 0 ? false : true}
							fullWidth
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
							{product.countInStock > 0
								? `Add to cart - $${Number(Number(product.price) * quantity).toFixed(2)}`
								: "Out of stock"}
						</Button>
						{product.countInStock > 0 && (
							<div className='w-full md:w-48'>
								<Select
									defaultValue={quantity}
									onChange={(e) => {
										setQuantity(Number(e.target.value));
									}}
									selectSize='lg'
								>
									{[...Array(product.countInStock).keys()].map((x) => (
										<option key={x + 1} value={x + 1}>
											{x + 1}
										</option>
									))}
								</Select>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
