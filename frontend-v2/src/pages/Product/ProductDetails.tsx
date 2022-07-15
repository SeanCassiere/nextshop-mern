import React from "react";
import AddToCart from "./AddToCart";
import ProductRating from "../../components/ProductRating";
import { Product } from "../../types/Product";

const ProductDetails: React.FC<{ product: Product }> = ({ product }) => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 py-2 gap-2'>
			<div className='pr-0 md:pr-2 rounded-lg'>
				<img src={product?.image} alt={product.name} className='object-cover' />
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2'>
				<div className='flex flex-col px-0 md:px-3'>
					<h2 className='text-2xl pb-5 font-bold tracking-tight text-gray-900 dark:text-white border border-t-0 border-l-0 border-r-0 border-b-gray-300 dark:border-b-gray-700'>
						{product.name}
					</h2>
					<div className='py-3 border border-t-0 border-l-0 border-r-0 border-b-gray-300 dark:border-b-gray-700'>
						<ProductRating rating={product.rating} text={`${product.numReviews} reviews`} />
					</div>
					<div className='py-3 border border-t-0 border-l-0 border-r-0 border-b-gray-300 dark:border-b-gray-700'>
						Price: ${Number(product.price).toFixed(2)}
					</div>
					<div className='py-3'>
						<p>Description: {product.description}</p>
					</div>
				</div>
				<div className='pl-0 md:pl-4'>
					<AddToCart product={product} />
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
