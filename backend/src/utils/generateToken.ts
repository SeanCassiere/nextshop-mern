import jwt from "jsonwebtoken";
import { env } from "../config/env";

const generateToken = (id: string) => {
	return jwt.sign({ id }, env.JWT_SECRET, {
		expiresIn: "30d",
	});
};

export default generateToken;
