import asyncHandler from "express-async-handler";
import Product, { ReviewDocument } from "../models/productModel";

// @desc Fetch all Active products
// @route GET /api/products
// @access Public
const getActiveProducts = asyncHandler(async (req, res) => {
	const pageSize = Number(req.query.pageSize) || 8;
	const page = Number(req.query.pageNumber) || 1;

	let regexp: RegExp;
	regexp = new RegExp("/ /", "i");

	if (typeof req.query.keyword === "string") {
		regexp = new RegExp(req.query.keyword, "i");
	}

	const keyword = req.query.keyword
		? {
				name: {
					$regex: regexp,
				},
		  }
		: {};

	try {
		const count = await Product.countDocuments({ isActive: true, ...keyword });
		const products = await Product.find({ isActive: true, ...keyword })
			.limit(pageSize)
			.skip(pageSize * (page - 1));

		res.json({ data: products, page, pages: Math.ceil(count / pageSize) });
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

// @desc Fetch all products
// @route GET /api/products
// @access Private/Admin
const getAllProducts = asyncHandler(async (req, res) => {
	const pageSize = 8;
	const page = Number(req.query.pageNumber) || 1;

	let regexp: RegExp;
	regexp = new RegExp("/ /", "i");

	if (typeof req.query.keyword === "string") {
		regexp = new RegExp(req.query.keyword, "i");
	}

	const keyword = req.query.keyword
		? {
				name: {
					$regex: regexp,
				},
		  }
		: {};

	try {
		const count = await Product.countDocuments({ ...keyword });
		const products = await Product.find({ ...keyword })
			.limit(pageSize)
			.skip(pageSize * (page - 1));

		res.json({ data: products, page, pages: Math.ceil(count / pageSize) });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: "Internal server error" });
	}
});

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

// @desc Delete Product By Id
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		await product.remove();
		res.json({ message: "Product removed" });
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

// @desc Create a Product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		name: "Sample Name",
		price: 0.0,
		user: req.user._id,
		image: "/images/sample.jpg",
		brand: "Sample Brand",
		category: "Sample Category",
		countInStock: 0,
		numReviews: 0,
		description: "Sample Description",
		isActive: false,
	});

	const createdProduct = await product.save();

	res.status(201);
	res.json(createdProduct);
});

// @desc Update a Product by Id
// @route PUT /api/products/:id
// @access Private/Admin
const updateProductById = asyncHandler(async (req, res) => {
	const { name, price, description, image, brand, category, countInStock, isActive } = req.body;

	const product = await Product.findById(req.params.id);

	if (product) {
		product.name = name;
		product.price = price;
		product.description = description;
		product.image = image;
		product.brand = brand;
		product.category = category;
		product.countInStock = countInStock;
		product.isActive = isActive;

		const updatedProduct = await product.save();
		res.status(201);
		res.json(updatedProduct);
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

// @desc Create new Review by Product Id
// @route POST /api/products/:id/reviews
// @access Private
const createProductReviewById = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body;

	const product = await Product.findById(req.params.id);

	if (product) {
		const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());

		if (alreadyReviewed) {
			res.status(400);
			throw new Error("You've already reviewed this product");
		}

		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment: comment,
			user: req.user._id,
		} as ReviewDocument;

		product.reviews.push(review);

		product.numReviews = product.reviews.length;

		product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

		await product.save();
		res.status(201).json({ message: "You've successfully left a review." });
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

// @desc Get Top Rated Active Products
// @route GET /api/products/top
// @access PUBLIC
const getTopProducts = asyncHandler(async (req, res) => {
	const pageSize = Number(req.query?.pageSize) || 3;
	const products = await Product.find({ isActive: true }).sort({ rating: -1 }).limit(pageSize);

	res.json(products);
});

export {
	getActiveProducts,
	getProductById,
	deleteProductById,
	getAllProducts,
	createProduct,
	updateProductById,
	createProductReviewById,
	getTopProducts,
};
