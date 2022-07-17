import React from "react";
import { useNavigate } from "@tanstack/react-location";

import ReviewForm from "./ReviewForm";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { Product } from "../../types/Product";

const ProductReviews: React.FC<{ product: Product }> = ({ product }) => {
	const navigate = useNavigate();
	const { user } = useAuth();

	const disableForm = React.useMemo(() => {
		const ids = product?.reviews?.map((r) => r.user) ?? [];
		console.log("ids", ids);
		return ids.includes(user?._id ?? "");
	}, [product.reviews, user?._id]);

	return (
		<div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
			<div className='md:col-span-8 flex flex-col gap-2 md:gap-4 pr-0 md:pr-2 divide-y divide-gray-100'>
				{product.reviews?.map((review) => (
					<div key={`review-${review._id}`} className='grid grid-cols-12 gap-4 pt-4 pb-2'>
						<div className='col-span-12 md:col-span-3'>
							<span className='text-xl font-semibold'>{review.name}</span>
						</div>
						<div className='col-span-12 md:col-span-9 flex flex-col gap-2'>
							<div className='flex justify-between'>
								<span className='text-sm'>{review.createdAt.substring(0, 10)}</span>
								<span className='text-lg font-medium'>{review.rating}/5</span>
							</div>
							<p className='text-md'>{review.comment}</p>
						</div>
					</div>
				))}
				{product.reviews?.length === 0 && (
					<div>
						<p className='font-medium'>This product has not yet been reviewed.</p>
					</div>
				)}
			</div>
			<div className='md:col-span-4'>
				<span className='block text-xl pb-3 font-semibold tracking-tight text-gray-900'>Leave a review</span>
				{user && (
					<ReviewForm
						productId={product._id}
						// disableForm={[...product?.reviews]?.map((r) => r?.user ?? "")?.includes(user?._id)}
						disableForm={disableForm}
					/>
				)}
				{!user && (
					<div>
						<Button
							fullWidth
							onClick={() => {
								navigate({ to: "/login", search: (prev) => ({ ...prev, redirect: window.location.pathname }) });
							}}
						>
							Login to leave to review
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductReviews;
