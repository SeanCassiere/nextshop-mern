import jwt, { Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "";

const generateToken = (id: string) => {
	return jwt.sign({ id }, JWT_SECRET, {
		expiresIn: "30d",
	});
};

export default generateToken;
