import { Request } from "express";
import { UserDocument } from "../models/userModel";

export interface CustomRequest<T> extends Request {
	body: T;
}

export interface TokenInterface {
	id: string;
}
