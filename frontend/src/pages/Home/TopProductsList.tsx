import React from "react";
import { Product } from "../../types/Product";
import { Link, useLoadRoute } from "@tanstack/react-location";

const TopProductsList: React.FC<{
	products: Product[];
}> = (props) => {
	const loadRoute = useLoadRoute();
	return (
		<div className='flex flex-col sm:overflow-y-auto md:flex-row gap-4 space-between justify-between py-4'>
			{props.products?.map((product) => (
				<React.Fragment key={`top-product-${product._id}`}>
					<div
						className='max-w-sm bg-white rounded-lg border border-gray-200 shadow-md'
						onMouseEnter={() => {
							loadRoute({ to: `/products/${product._id}` });
						}}
					>
						<Link to={`/products/${product._id}`}>
							<img className='rounded-t-lg' src={product.image} alt='' />
						</Link>
						<div className='p-5'>
							<Link to={`/products/${product._id}`}>
								<h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>{product.name}</h5>
							</Link>
							<p className='mb-3 font-normal text-gray-700 truncate'>{product.description}</p>
							<Link
								to={`/products/${product._id}`}
								className='inline-flex items-center py-2 px-3 text-sm font-medium text-center duration-150 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300'
							>
								View
								<svg
									aria-hidden='true'
									className='ml-2 -mr-1 w-4 h-4'
									fill='currentColor'
									viewBox='0 0 20 20'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										fillRule='evenodd'
										d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
										clipRule='evenodd'
									></path>
								</svg>
							</Link>
						</div>
					</div>
				</React.Fragment>
			))}
		</div>
	);
};

export default TopProductsList;
