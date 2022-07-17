import React from "react";
import { Helmet } from "react-helmet-async";

import { useCart } from "../../context/CartContext";
import Header from "../../components/Header";
import { Navigate } from "@tanstack/react-location";

const Checkout = () => {
	const { items } = useCart();

	if (items.length === 0) {
		return <Navigate to='/' />;
	}

	return (
		<React.Fragment>
			<Header />
			<Helmet>
				<title>Checkout | Nextshop</title>
			</Helmet>
			<main>
				<section className='py-4'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>Checkout</div>
				</section>
			</main>
		</React.Fragment>
	);
};

export default Checkout;
