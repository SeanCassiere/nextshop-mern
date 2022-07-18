import React from "react";
import { Link, useLoadRoute } from "@tanstack/react-location";

import { Product } from "../types/Product";
import { formatPrice } from "../utils/format";

const ProductsGrid: React.FC<{
	products: Product[];
}> = ({ products }) => {
	const loadRoute = useLoadRoute();
	return (
		<div className='grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
			{products.map((product) => (
				<div
					key={`product-${product._id}`}
					className='group relative duration-150'
					onMouseEnter={() => {
						loadRoute({ to: `/products/${product._id}` });
					}}
				>
					<div className='w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none'>
						<img
							src={product.image}
							alt={product.name}
							className='w-full h-full object-center object-cover lg:w-full lg:h-full'
						/>
					</div>
					<h3 className='mt-4 text-sm text-gray-700'>
						<Link to={`/products/${product._id}`}>
							<span className='absolute inset-0' />
							{product.name}
						</Link>
					</h3>
					<p className='mt-1 text-sm text-gray-500'>{product.countInStock > 0 ? "In-stock" : "Out-of-stock"}</p>
					<p className='mt-1 text-sm font-medium text-gray-900'>{formatPrice(product.price)}</p>
				</div>
			))}
		</div>
	);
};

export default ProductsGrid;
