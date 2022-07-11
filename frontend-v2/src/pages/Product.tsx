import React from "react";
import { Link, useMatch } from "@tanstack/react-location";
import { useQuery } from "react-query";
import { getPublicProductById } from "../api/products";

const Product = () => {
	const {
		params: { productId },
	} = useMatch();

	const productQuery = useQuery(["products", productId], () => getPublicProductById(productId));

	return (
		<div>
			<div>
				<Link to='/'>Back home</Link>
			</div>
			<div>
				Product Page for id: {productId}
				{productQuery.isLoading && "..."}
			</div>
			<div>
				<span>data</span>
				<pre>{JSON.stringify(productQuery.data, null, 2)}</pre>
			</div>
		</div>
	);
};

export default React.memo(Product);
