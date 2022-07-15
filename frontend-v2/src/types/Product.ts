export type Product = {
	_id: string;
	user: string;
	name: string;
	image: string;
	brand: string;
	description: string;
	category: string;
	price: number;
	countInStock: number;
	numReviews: number;
	rating: number;
	isActive: boolean;
	reviews: ProductReview[];
	createdAt: string;
	updatedAt: string;
};

export type ProductReview = {
	_id: string;
	user: string;
	name: string;
	rating: number;
	comment: string;
	createdAt: string;
	updatedAt: string;
};

export type ProductsPaginated = {
	products: Product[];
	page: number;
	pages: number;
};
