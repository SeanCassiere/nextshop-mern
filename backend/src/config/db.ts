import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
		});

		console.log(colors.cyan.underline(`MongoDB Connected: ${conn.connection.host}`));
	} catch (error) {
		console.error(colors.red.bold.underline(`Error: ${error.message}`));
		process.exit(1);
	}
};

export default connectDB;
