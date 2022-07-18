import React from "react";
import { useLoadRoute } from "@tanstack/react-location";

import StoreProduct from "./StoreProduct";
import { Product } from "../types/Product";

const ProductsGrid: React.FC<{
	products: Product[];
}> = ({ products }) => {
	const loadRoute = useLoadRoute();
	return (
		<div className='grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
			{products?.map((product) => (
				<React.Fragment key={`product-${product._id}`}>
					<StoreProduct
						product={product}
						onMouseEnterFn={() => {
							loadRoute({ to: `/products/${product._id}` });
						}}
					/>
				</React.Fragment>
			))}
		</div>
	);
};

export default ProductsGrid;
