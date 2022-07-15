import React from "react";
import { Link } from "@tanstack/react-location";
import ProductRating from "../../components/ProductRating";
import ReviewForm from "./ReviewForm";
import { useAuth } from "../../context/AuthContext";
import { Product } from "../../types/Product";

const ProductReviews: React.FC<{ product: Product }> = ({ product }) => {
	const { user } = useAuth();

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
			<div className='flex flex-col gap-4 pr-0 md:pr-2'>
				{product.reviews?.map((review) => (
					<div key={`review-${review._id}`} className='p-4 bg-gray-50 dark:bg-gray-800 flex flex-col rounded-lg'>
						<div className='flex flex-row items-center'>
							<span className='text-lg flex-1'>{review.name}</span>
							<ProductRating rating={review.rating} />
						</div>
						<span className='text-sm'>{review.createdAt.substring(0, 10)}</span>
						<p className='text-base mt-2 italic'>{review.comment}</p>
					</div>
				))}
				{product.reviews?.length === 0 && (
					<div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
						<p className='italic'>No reviews for this product</p>
					</div>
				)}
			</div>
			<div>
				<span className='block text-xl pb-3 font-semibold tracking-tight text-gray-900 dark:text-white'>
					Leave a review
				</span>
				{user && <ReviewForm productId={product._id} />}
				{!user && (
					<div>
						<Link
							to='/login'
							search={(prev) => ({ ...prev, redirect: window.location.pathname })}
							className='text-blue-800 dark:text-blue-600'
						>
							Login
						</Link>
						&nbsp;to leave a review
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductReviews;
