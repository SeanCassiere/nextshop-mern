import React, { useId, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const FormInput: React.FC<
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
				border-2 text-md rounded-md
				bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-400 focus:border-blue-400
				dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-blue-700 dark:focus:border-blue-700
				disabled:bg-gray-200 disabled:cursor-not-allowed dark:disabled:bg-gray-900
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

export default FormInput;
