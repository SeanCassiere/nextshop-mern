import React from "react";
import { Navigate, useMatch } from "@tanstack/react-location";
import { Helmet } from "react-helmet-async";

import { LocationGenerics } from "../../App";
import Header from "../../components/Header";

const Order = () => {
	const {
		params: { orderId },
	} = useMatch<LocationGenerics>();

	if (orderId.trim() === "/" || orderId.trim() === "") {
		return <Navigate to='/' replace />;
	}

	return (
		<React.Fragment>
			<Header />
			<Helmet>
				<title>Nextshop | Order - {orderId && `${orderId}`}</title>
			</Helmet>
			<main>
				<section className='py-4'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>Order Page</div>
				</section>
			</main>
		</React.Fragment>
	);
};

export default Order;
