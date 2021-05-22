import path from "path";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db";

import type { UserDocument } from "./models/userModel";

import { notFound, errorHandler } from "./middleware/errorMiddleware";

import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
// import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes";

dotenv.config();

connectDB();

const app = express();

declare global {
	namespace Express {
		interface Request {
			user: UserDocument;
		}
	}
}

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (_, res: Response) => {
	res.send("API is Running");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (_, res) => res.send(process.env.PAYPAL_CLIENT_ID));

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
	console.log(colors.yellow.bold(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
);
