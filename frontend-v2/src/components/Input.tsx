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
				border border-gray-200 text-md rounded-md
				bg-gray-50 text-gray-900 focus:ring-indigo-400 focus:border-indigo-400
				dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-indigo-700 dark:focus:border-indigo-700
				disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-900 disabled:text-gray-600 dark:disabled:text-gray-500
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
