import Stripe from "stripe";
import { env } from "./env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: "2020-08-27",
});

export default stripe;
