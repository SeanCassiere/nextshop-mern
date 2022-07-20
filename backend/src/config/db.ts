import mongoose from "mongoose";
import colors from "colors";
import { env } from "./env";

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(env.MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
		});

		console.log(colors.cyan.underline(`MongoDB Connected: ${conn.connection.host}`));
		return conn;
	} catch (error) {
		console.error(colors.red.bold.underline(`Error: ${(error as unknown as Error).message}`));
		process.exit(1);
	}
};

export default connectDB;
