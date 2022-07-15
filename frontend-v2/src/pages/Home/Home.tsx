import React from "react";
import { Link, useMatch, useNavigate, useSearch } from "@tanstack/react-location";
import { useQuery } from "react-query";

import Header from "../../components/Header";

import { getPublicProducts, getPublicTopProducts } from "../../api/products";
import { Product, ProductsPaginated } from "../../types/Product";
import TopProductsList from "./TopProductsList";
import ProductsGrid from "../../components/ProductsGrid";
import { LocationGenerics } from "../../App";
import Paginate from "../../components/Paginate";

const Home = () => {
	const [maxPages, setMaxPages] = React.useState(1);

	const { page = 1 } = useSearch<LocationGenerics>();

	const topProductsQuery = useQuery<Product[], any>(["products", "top"], getPublicTopProducts);

	const productsQuery = useQuery<ProductsPaginated, any>(
		["products", `page-${page}`],
		() => getPublicProducts({ pageNumber: Number(page) }),
		{
			keepPreviousData: true,
			onSuccess: (data) => {
				setMaxPages(data.pages);
			},
		}
	);

	return (
		<React.Fragment>
			<Header />
			<main>
				<section className='bg-gray-100 dark:bg-gray-900 py-4'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[32rem]'>
						<h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
							Top products{topProductsQuery.status === "loading" && "..."}
						</h2>
						{topProductsQuery.status === "loading" && !topProductsQuery.data && (
							<div className='min-h-full'>&nbsp;</div>
						)}
						{topProductsQuery.data && <TopProductsList products={topProductsQuery.data} />}
					</div>
				</section>
				<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
						Latest products{productsQuery.status === "loading" && "..."}
					</h2>
					<div className='mt-5'>
						{productsQuery.status === "loading" && !productsQuery.data && <div className='min-h-[32rem]'>&nbsp;</div>}
						{productsQuery.data && (
							<>
								<ProductsGrid products={productsQuery.data.products} />
								<Paginate page={page} pages={productsQuery.data.pages} />
							</>
						)}
					</div>
				</section>
			</main>
		</React.Fragment>
	);
};

export default Home;
