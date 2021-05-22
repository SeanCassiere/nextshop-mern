import mongoose, { Schema, Document, Model } from "mongoose";
import User, { UserDocument } from "./userModel";

// Review Modelling
const reviewSchema = new Schema<ReviewDocument, ReviewModel>(
	{
		name: { type: String, required: true },
		rating: { type: Number, required: true },
		comment: { type: String, required: true },
		user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: User },
	},
	{
		timestamps: true,
	}
);

export interface ReviewInter {
	name: string;
	rating: number;
	comment: string;
	user: UserDocument;
}
export interface ReviewDocument extends ReviewInter, Document {}
export interface ReviewModel extends Model<ReviewDocument> {}

// Product Modelling
const productSchema = new Schema<ProductInter, ProductModel>(
	{
		user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: User },
		name: { type: String, required: true },
		image: { type: String, required: true },
		brand: { type: String, required: true },
		description: { type: String, required: true },
		category: { type: String, required: true },
		reviews: [reviewSchema],
		rating: { type: Number, required: true, default: 0 },
		numReviews: { type: Number, required: true, default: 0 },
		price: { type: Number, required: true, default: 0 },
		countInStock: { type: Number, required: true, default: 0 },
		isActive: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
);

export interface ProductInter {
	user: mongoose.Schema.Types.ObjectId;
	name: string;
	image: string;
	brand: string;
	description: string;
	category: string;
	reviews: ReviewDocument[];
	rating: number;
	numReviews: number;
	price: number;
	countInStock: number;
	isActive: boolean;
}
interface ProductDocument extends ProductInter, Document {}
interface ProductModel extends Model<ProductDocument> {}

const Product = mongoose.model("product", productSchema);

export default Product;
