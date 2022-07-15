import React from "react";
import { Link, useMatch } from "@tanstack/react-location";
import { useQuery } from "react-query";

import Header from "../components/Header";

import { getPublicProductById } from "../api/products";

const Product = () => {
	const {
		params: { productId },
	} = useMatch();

	const productQuery = useQuery(["products", productId], () => getPublicProductById(productId));

	return (
		<React.Fragment>
			<Header />
			<main>
				<div>
					<Link to='/' search={(searchOld) => ({ ...searchOld })}>
						Back home
					</Link>
				</div>
				<div>
					Product Page for id: {productId}
					{productQuery.isLoading && "..."}
				</div>
				<div>
					{productQuery.data && (
						<table className='table-auto border-collapse border border-slate-400'>
							<tr>
								<th className='w-1/2 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left'>
									Key
								</th>
								<th className='w-1/2 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left'>
									Value
								</th>
							</tr>
							{Object.entries(productQuery.data).map(([key, value]) => (
								<tr key={`row-${key}-${value}`}>
									<td className='border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400'>
										{key}
									</td>
									<td className='border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400'>
										{JSON.stringify(value)}
									</td>
								</tr>
							))}
						</table>
					)}
				</div>
			</main>
		</React.Fragment>
	);
};

export default React.memo(Product);
