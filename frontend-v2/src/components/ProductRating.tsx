import React from "react";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

const ProductRating: React.FC<{
	rating?: number;
	text?: string;
	color?: string;
}> = ({ rating = 0, text, color = "#f8e825" }) => {
	return (
		<div className='flex flex-row items-center'>
			<span>
				{rating >= 1 ? (
					<BsStarFill style={{ color }} />
				) : rating >= 0.5 ? (
					<BsStarHalf style={{ color }} />
				) : (
					<BsStar style={{ color }} />
				)}
			</span>
			<span>
				{rating >= 2 ? (
					<BsStarFill style={{ color }} />
				) : rating >= 1.5 ? (
					<BsStarHalf style={{ color }} />
				) : (
					<BsStar style={{ color }} />
				)}
			</span>
			<span>
				{rating >= 3 ? (
					<BsStarFill style={{ color }} />
				) : rating >= 2.5 ? (
					<BsStarHalf style={{ color }} />
				) : (
					<BsStar style={{ color }} />
				)}
			</span>
			<span>
				{rating >= 4 ? (
					<BsStarFill style={{ color }} />
				) : rating >= 3.5 ? (
					<BsStarHalf style={{ color }} />
				) : (
					<BsStar style={{ color }} />
				)}
			</span>
			<span>
				{rating === 5 ? (
					<BsStarFill style={{ color }} />
				) : rating >= 4.5 ? (
					<BsStarHalf style={{ color }} />
				) : (
					<BsStar style={{ color }} />
				)}
			</span>
			<span>&nbsp;{text && text}</span>
		</div>
	);
};

export default ProductRating;
