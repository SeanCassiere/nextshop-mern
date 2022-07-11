import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

import users from "./data/users";
import products from "./data/products";

import User from "./models/userModel";
import Product from "./models/productModel";
import Order from "./models/orderModel";

import connectDB from "./config/db";

dotenv.config();

const importData = async () => {
	await connectDB();

	try {
		await Order.deleteMany();
		await Product.deleteMany();
		await User.deleteMany();

		const createdUsers = await User.insertMany(users);
		const adminUser = createdUsers[0]._id;

		const sampleProducts = products.map((p) => {
			return { ...p, user: adminUser };
		});

		await Product.insertMany(sampleProducts);

		console.log(colors.green.inverse("Data Imported"));
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
		await User.deleteMany();

		console.log(colors.green.inverse("Data Destroyed"));
		process.exit();
	} catch (error) {
		console.error(colors.red.inverse(error));
		process.exit(1);
	}
};

if (process.argv[2] === "-d") {
	destroyData();
} else {
	importData();
}
