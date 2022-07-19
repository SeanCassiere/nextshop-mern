import Stripe from "stripe";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: "2020-08-27",
});

export default stripe;
