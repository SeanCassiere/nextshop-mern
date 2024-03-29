import React from "react";
import { useSearch } from "@tanstack/react-location";
import { useQuery } from '@tanstack/react-query';
import { Helmet } from "react-helmet-async";

import Header from "../../components/Header";
import ProductsGrid from "../../components/ProductsGrid";
import TopProductsList from "./TopProductsList";
import Paginate from "../../components/Paginate";

import { getPublicProducts, getPublicTopProducts } from "../../api/products";
import { Product } from "../../types/Product";
import { LocationGenerics } from "../../App";
import { ResponseParsed } from "../../api/base";

const TOP_PRODUCTS_COUNT = 3;

const Home = () => {
	const { page = 1 } = useSearch<LocationGenerics>();

	const topProductsQuery = useQuery<ResponseParsed<Product[]>, any>(["products", "top", `${TOP_PRODUCTS_COUNT}`], () =>
		getPublicTopProducts({ pageSize: TOP_PRODUCTS_COUNT })
	);

	const productsQuery = useQuery<ResponseParsed<Product[]>, any>(
		["products", `page-${page}`],
		() => getPublicProducts({ pageNumber: Number(page) }),
		{
			keepPreviousData: true,
		}
	);

	return (
		<React.Fragment>
			<Header />
			<Helmet>
				<title>Store | Nextshop</title>
			</Helmet>
			<main>
				<section className='bg-gray-100 py-4'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[32rem]'>
						<h2 className='text-3xl font-bold tracking-tight text-gray-900'>
							Top products{topProductsQuery.status === "loading" && "..."}
						</h2>
						{topProductsQuery.status === "loading" && !topProductsQuery.data && (
							<div className='min-h-full'>&nbsp;</div>
						)}
						{topProductsQuery.data && topProductsQuery.data.data && (
							<TopProductsList products={topProductsQuery.data.data} />
						)}
					</div>
				</section>
				<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<h2 className='text-3xl font-bold tracking-tight text-gray-900'>
						Latest products{productsQuery.status === "loading" && "..."}
					</h2>
					<div className='mt-5 mb-5'>
						{productsQuery.status === "loading" && !productsQuery.data && <div className='min-h-[32rem]'>&nbsp;</div>}
						{productsQuery.data && productsQuery.data.data && (
							<>
								<ProductsGrid products={productsQuery.data.data} />
								{productsQuery.data.totalPages > 1 && (
									<div className='py-4'>
										<Paginate page={page} pages={productsQuery.data.totalPages} />
									</div>
								)}
							</>
						)}
					</div>
				</section>
			</main>
		</React.Fragment>
	);
};

export default Home;
