import dotenv from "dotenv";
import { verify } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";

import UserModel from "../models/userModel";
import type { UserModel as UserInt } from "../models/userModel";
import { CustomRequest, TokenInterface } from "../utils/CustomInterfaces";
import { env } from "../config/env";

dotenv.config();

const protect = asyncHandler(async (req: CustomRequest<UserInt>, res: Response, next: NextFunction) => {
	let token: string = "";

	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = verify(token, env.JWT_SECRET) as TokenInterface;

			const userFound = await UserModel.findById(decoded.id).select("-password");

			if (userFound) {
				req.user = userFound;
			} else {
				throw new Error("No User found");
			}

			next();
		} catch (error) {
			res.status(401);
			throw new Error("Not Authorized, token failed");
		}
	}

	if (token.length === 0) {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});

const isAdmin = (req: CustomRequest<UserInt>, res: Response, next: NextFunction) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.status(401);
		throw Error("Not authorized, must be an admin");
	}
};

export { protect, isAdmin };
