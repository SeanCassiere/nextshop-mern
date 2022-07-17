import path from "path";
import express, { Response } from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db";
import cors from "cors";

import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import type { UserDocument } from "./models/userModel";

import { notFound, errorHandler } from "./middleware/errorMiddleware";

import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import uploadRoutes from "./routes/uploadRoutes";

dotenv.config();

const PORT = process.env.PORT || 5000;

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "NextShop API",
			version: "1.0.0",
			description: "A simple Express Library API",
			termsOfService: "http://example.com/terms",
			contact: {
				name: "SeanCassiere",
				url: "http://example.com/support",
				email: "sean@example.com",
			},
		},
		servers: [
			{
				url: `http://localhost:${PORT}/api`,
			},
		],
	},
	apis: ["./backend/**/routes/*"],
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

const app = express();

declare global {
	namespace Express {
		interface Request {
			user: UserDocument;
		}
	}
}

async function main() {
	connectDB()
		.then(() => {})
		.catch((e) => {
			throw e;
		});

	app.use(
		cors({
			credentials: true,
			origin: (url, cb) => cb(null, url),
		})
	);

	if (process.env.NODE_ENV === "development") {
		app.use(morgan("dev"));
	}

	app.use(express.json());

	app.get("/", (_, res: Response) => {
		res.send("<h1>API is Running</h1><p>View <a href='/api-docs'>API Docs</a></p>");
	});

	app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

	app.use("/api/products", productRoutes);
	app.use("/api/users", userRoutes);
	app.use("/api/orders", orderRoutes);
	app.use("/api/upload", uploadRoutes);

	app.get("/api/config/paypal", (_, res) => res.send(process.env.PAYPAL_CLIENT_ID ?? null));

	const __dirname = path.resolve();
	app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

	app.use(notFound);
	app.use(errorHandler);

	app.listen(PORT, () =>
		console.log(colors.yellow.bold(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
	);
}

main();
