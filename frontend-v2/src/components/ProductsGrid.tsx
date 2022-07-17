import React from "react";
import { Product } from "../types/Product";
import { Link } from "@tanstack/react-location";
import ProductRating from "./ProductRating";

const ProductsGrid: React.FC<{
	products: Product[];
}> = ({ products }) => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
			{products.map((product) => (
				<React.Fragment key={`product-${product._id}`}>
					<div className='max-w-sm bg-white rounded-md border border-gray-200 shadow-md'>
						<Link to={`/products/${product._id}`}>
							<img className='rounded-t-md' src={product.image} alt='' />
						</Link>
						<div className='p-5 flex flex-col justify-between'>
							<Link to={`/products/${product._id}`}>
								<h5 className='mb-2 text-xl font-semibold tracking-tight text-gray-900'>{product.name}</h5>
							</Link>
							<p className='mb-2 text-3xl font-semibold tracking-tight text-gray-900'>
								${Number(product.price).toFixed(2)}
							</p>
							<div className='mb-3 font-normal text-gray-700'>
								<ProductRating rating={product.rating} text={`${product.numReviews} reviews`} />
							</div>
						</div>
					</div>
				</React.Fragment>
			))}
		</div>
	);
};

export default ProductsGrid;
