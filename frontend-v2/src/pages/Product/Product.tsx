import React from "react";
import { useMatch, useLocation } from "@tanstack/react-location";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet-async";

import Header from "../../components/Header";

import { getPublicProductById } from "../../api/products";
import { Product } from "../../types/Product";
import ProductDetails from "./ProductDetails";
import ProductReviews from "./ProductReviews";

const ProductPage = () => {
	const {
		params: { productId },
	} = useMatch();

	const location = useLocation();

	const productQuery = useQuery<Product>(["products", productId], () => getPublicProductById(productId));

	return (
		<React.Fragment>
			<Header />
			<main>
				{productQuery.data && (
					<React.Fragment>
						<Helmet>
							<title>{`${productQuery.data?.name}`} | Nextshop</title>
						</Helmet>
						<section className='bg-gray-100 dark:bg-gray-900 py-4'>
							<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[32rem]'>
								<div className='h-full flex flex-col'>
									<div className='my-1'>
										<button
											onClick={() => location.history.back()}
											className='rounded-md py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700'
										>
											Go Back
										</button>
									</div>
									<ProductDetails product={productQuery.data} />
								</div>
							</div>
						</section>
						<section>
							<div className='max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8'>
								<h2 className='text-3xl pb-3 font-bold tracking-tight text-gray-900 dark:text-white'>Reviews</h2>
								<ProductReviews product={productQuery.data} />
							</div>
						</section>
					</React.Fragment>
				)}
			</main>
		</React.Fragment>
	);
};

export default React.memo(ProductPage);
