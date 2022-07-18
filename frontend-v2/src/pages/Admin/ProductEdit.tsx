import React from "react";
import { Helmet } from "react-helmet-async";

import Header from "../../components/Header";

const ProductEdit = () => {
	return (
		<React.Fragment>
			<Header />
			<Helmet>
				<title>Product Edit</title>
			</Helmet>
		</React.Fragment>
	);
};

export default ProductEdit;
