import React, { useEffect, useRef } from "react";
import { useMatch, useLocation, Navigate, useNavigate } from "@tanstack/react-location";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet-async";

import Header from "../../components/Header";
import ProductDetails from "./ProductDetails";
import ProductReviews from "./ProductReviews";
import ProductsGrid from "../../components/ProductsGrid";

import { getPublicProductById, getPublicTopProducts } from "../../api/products";
import { Product } from "../../types/Product";

const TOP_PRODUCTS_COUNT = 4;

const ProductPage = () => {
	const navigate = useNavigate();
	const {
		params: { productId },
	} = useMatch();

	const location = useLocation();

	const sectionRef = useRef<HTMLElement | null>(null);

	const productQuery = useQuery<Product>(["products", productId], () => getPublicProductById(productId), {
		onError: () => {
			navigate({ to: "/" });
		},
	});

	const trendingProductsQuery = useQuery<Product[]>(["products", "top", `${TOP_PRODUCTS_COUNT}`], () =>
		getPublicTopProducts({ pageSize: TOP_PRODUCTS_COUNT })
	);

	useEffect(() => {
		if (sectionRef.current) {
			sectionRef.current.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
		window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	}, [productId]);

	if (productId.trim() === "/" || productId.trim() === "") {
		return <Navigate to='/' replace />;
	}

	return (
		<React.Fragment>
			<Header />
			<main>
				{productQuery.data && (
					<React.Fragment>
						<Helmet>
							<title>{`${productQuery.data?.name}`} | Nextshop</title>
						</Helmet>
						<section ref={sectionRef} className='py-4'>
							<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[32rem]'>
								<div className='h-full flex flex-col'>
									<div className='my-1'>
										<button
											onClick={() => location.history.back()}
											className='rounded-md py-2 px-4 bg-none hover:bg-gray-50'
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
								<h2 className='text-3xl pb-3 font-bold tracking-tight text-gray-900'>Customer reviews</h2>
								<ProductReviews product={productQuery.data} />
							</div>
						</section>
						<section>
							<div className='max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8'>
								<h2 className='text-2xl pb-3 font-bold tracking-tight text-gray-800'>Trending products</h2>
								{trendingProductsQuery.data && <ProductsGrid products={trendingProductsQuery.data} />}
							</div>
						</section>
					</React.Fragment>
				)}
			</main>
		</React.Fragment>
	);
};

export default React.memo(ProductPage);
