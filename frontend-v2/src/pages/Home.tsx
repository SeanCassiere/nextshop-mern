import { Link } from "@tanstack/react-location";
import React from "react";
import { useQuery } from "react-query";
import { getPublicProducts, getPublicTopProducts } from "../api/products";
import { Product, ProductsPaginated } from "../types/Product";

const Home = () => {
	const [page, setPage] = React.useState(1);
	const [maxPages, setMaxPages] = React.useState(1);

	const topProductsQuery = useQuery<Product[], any>(["products", "top"], getPublicTopProducts);

	const productsQuery = useQuery<ProductsPaginated, any>(
		["products", `page-${page}`],
		() => getPublicProducts({ pageNumber: page }),
		{
			keepPreviousData: true,
			onSuccess: (data) => {
				setMaxPages(data.pages);
			},
		}
	);

	return (
		<div>
			<h1>HomePage</h1>
			<div>
				<h2>Top Products{topProductsQuery.status === "loading" && "..."}</h2>
				<p>
					{topProductsQuery.data && (
						<>
							{topProductsQuery.data.map((product) => (
								<div key={`top-${product._id}`}>
									<Link to={`/products/${product._id}`}>{product.name}</Link>
								</div>
							))}
						</>
					)}
				</p>
			</div>
			<div className='mt-5'>
				<h2>Products{productsQuery.status === "loading" && "..."}</h2>
				<p>
					<button
						onClick={() =>
							setPage((prev) => {
								if (prev === 1) {
									return prev;
								}

								return prev - 1;
							})
						}
						className='ml-5 mr-5'
					>
						-
					</button>
					<button
						onClick={() =>
							setPage((prev) => {
								if (prev === maxPages) {
									return prev;
								}
								return prev + 1;
							})
						}
						className='mr-5'
					>
						+
					</button>
					{page}/{maxPages}
				</p>
				<p>{productsQuery.data && <>{JSON.stringify(productsQuery.data)}</>}</p>
			</div>
		</div>
	);
};

export default Home;
