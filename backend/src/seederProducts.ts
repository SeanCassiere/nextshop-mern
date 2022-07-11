import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

import products from "./data/products.js";

import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";

import connectDB from "./config/db.js";

dotenv.config();

const importData = async () => {
	await connectDB();
	try {
		await Order.deleteMany();
		await Product.deleteMany();

		const adminUserFromDB = await User.findOne({ email: "admin@example.com" });

		if (adminUserFromDB === null) {
			throw new Error("User not found");
		}

		const adminUserId = adminUserFromDB._id;

		const sampleProducts = products.map((p) => {
			return { ...p, user: adminUserId };
		});

		await Product.insertMany(sampleProducts);

		console.log(colors.green.inverse("Product Data Imported"));
		process.exit();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

const destroyData = async () => {
	await connectDB();
	try {
		await Order.deleteMany();
		await Product.deleteMany();

		console.log(colors.green.inverse("Product Data Destroyed"));
		process.exit();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

if (process.argv[2] === "-d") {
	destroyData();
} else {
	importData();
}
