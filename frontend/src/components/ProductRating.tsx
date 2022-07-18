import React from "react";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

const ProductRating: React.FC<{
	rating?: number;
	text?: string;
	color?: string;
	colorClass?: string;
}> = ({ rating = 0, text, color = "#f8e825", colorClass = "text-indigo-600" }) => {
	return (
		<div className='flex flex-row items-center'>
			<span>
				{rating >= 1 ? (
					<BsStarFill className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				) : rating >= 0.5 ? (
					<BsStarHalf className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				) : (
					<BsStar className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				)}
			</span>
			<span>
				{rating >= 2 ? (
					<BsStarFill className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				) : rating >= 1.5 ? (
					<BsStarHalf className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				) : (
					<BsStar className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				)}
			</span>
			<span>
				{rating >= 3 ? (
					<BsStarFill className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				) : rating >= 2.5 ? (
					<BsStarHalf className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				) : (
					<BsStar className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				)}
			</span>
			<span>
				{rating >= 4 ? (
					<BsStarFill className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				) : rating >= 3.5 ? (
					<BsStarHalf className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				) : (
					<BsStar className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				)}
			</span>
			<span>
				{rating === 5 ? (
					<BsStarFill className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				) : rating >= 4.5 ? (
					<BsStarHalf className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				) : (
					<BsStar className={`${colorClass}`} style={{ color: !colorClass ? color : undefined }} />
				)}
			</span>
			<span>&nbsp;{text && text}</span>
		</div>
	);
};

export default ProductRating;
