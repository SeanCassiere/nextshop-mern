// this has been ripped off of the starter provided by create-t3-app -> https://create.t3.gg/

import dotenv from "dotenv";
import { z, ZodFormattedError } from "zod";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]),
	PORT: z.string(),
	MONGO_URI: z.string(),
	JWT_SECRET: z.string(),
	PAYPAL_CLIENT_ID: z.string(),
	STRIPE_PUBLISHABLE_KEY: z.string(),
	STRIPE_SECRET_KEY: z.string(),
});

const envData = envSchema.safeParse(process.env);

const formatErrors = (errors: ZodFormattedError<Map<string, string>, string>) =>
	Object.entries(errors)
		.map(([name, value]) => {
			if (value && "_errors" in value) return `${name}: ${value._errors.join(", ")}\n`;
		})
		.filter(Boolean);

if (!envData.success) {
	console.error("❌ Invalid environment variables:\n", ...formatErrors(envData.error.format()));
	process.exit(1);
}

export const env = envData.data;
