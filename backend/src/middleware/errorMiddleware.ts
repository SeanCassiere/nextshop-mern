import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

const notFound = (req: Request, res: Response, next: NextFunction) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: env.NODE_ENV === "production" ? undefined : err.stack,
	});
};

export { notFound, errorHandler };
