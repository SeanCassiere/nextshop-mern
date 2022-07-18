import React, { useId, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const Input: React.FC<
	{ label?: string } & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = (props) => {
	const { label, className, type, ...inputProps } = props;
	const elementId = useId();
	const [showPassword, setShowPassword] = useState(false);
	return (
		<div className='flex flex-col relative gap-1'>
			{label && (
				<label className='text-md' htmlFor={elementId}>
					{label}
				</label>
			)}
			<input
				id={elementId}
				type={type !== "password" ? type : showPassword ? "text" : "password"}
				className={`
				px-4 py-2 
				border border-gray-200 text-md rounded-md shadow-sm
				text-gray-900 focus:ring-indigo-400 focus:border-indigo-400
				disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400
				${className}`}
				{...inputProps}
			/>
			{type === "password" && (
				<button
					type='button'
					className='absolute top-[55%] right-4 text-xl'
					onClick={() => setShowPassword((prev) => !prev)}
				>
					{showPassword ? <BsEye /> : <BsEyeSlash />}
				</button>
			)}
		</div>
	);
};

export default Input;
