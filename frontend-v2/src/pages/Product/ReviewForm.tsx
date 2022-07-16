import React from "react";
import { useMutation, useQueryClient } from "react-query";

import { postProductReview } from "../../api/products";
import FormButton from "../../components/FormButton";
import FormSelect from "../../components/FormSelect";
import FormTextArea from "../../components/FormTextArea";
import { useAuth } from "../../context/AuthContext";

const ReviewForm: React.FC<{ productId: string }> = ({ productId }) => {
	const { user } = useAuth();

	const queryClient = useQueryClient();

	const [body, setBody] = React.useState({
		comment: "",
		rating: 3,
	});

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
		if (e?.target?.name === "comment") {
			setBody((prev) => ({
				...prev,
				comment: e.target.value,
			}));
		}
		if (e?.target?.name === "rating") {
			setBody((prev) => ({
				...prev,
				rating: Number(e.target.value),
			}));
		}
	};

	const { mutate: review } = useMutation(postProductReview, {
		onSuccess: () => {
			queryClient.invalidateQueries(["products", productId]);
			setBody((prev) => ({ ...prev, rating: 3, comment: "" }));
		},
	});

	return (
		<form
			className='flex flex-col gap-3'
			autoComplete='off'
			onSubmit={(e) => {
				e.preventDefault();
				const safeRating = body.rating > 5 ? 5 : body.rating < 0 ? 1 : body.rating;
				review({ productId, rating: safeRating, comment: body.comment, token: user?.token || "" });
			}}
		>
			<FormSelect label='Rating' name='rating' defaultValue={`${body.rating}`} onChange={handleChange} required>
				<option value='1'>1 - Poor</option>
				<option value='2'>2 - Fair</option>
				<option value='3'>3 - Good</option>
				<option value='4'>4 - Very Good</option>
				<option value='5'>5 - Excellent</option>
			</FormSelect>
			<FormTextArea label='Comment' name='comment' value={body.comment} onChange={handleChange} required />
			<FormButton className='mt-3' type='submit'>
				Submit
			</FormButton>
		</form>
	);
};

export default ReviewForm;