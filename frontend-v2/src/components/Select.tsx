import React, { useId } from "react";

type SelectSize = "sm" | "md" | "lg" | "xl";

const Select: React.FC<
	{ label?: string; selectSize?: SelectSize } & React.DetailedHTMLProps<
		React.SelectHTMLAttributes<HTMLSelectElement>,
		HTMLSelectElement
	>
> = (props) => {
	const { label, className, children, selectSize = "md", ...selectProps } = props;

	const elementId = useId();

	return (
		<div className='flex flex-col relative gap-1'>
			{label && (
				<label className='text-md' htmlFor={elementId}>
					{label}
				</label>
			)}
			<select
				id={elementId}
				className={`
				${selectSize === "sm" && "px-4 py-2"}
				${selectSize === "md" && "px-5 py-2.5"}
				${selectSize === "lg" && "px-6 py-3"}
				${selectSize === "xl" && "px-7 py-3.5"}  
				border border-gray-200 text-md rounded-md
				bg-gray-50 text-gray-900 focus:ring-indigo-400 focus:border-indigo-400
				dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-indigo-700 dark:focus:border-indigo-700
				disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-900 disabled:text-gray-600 dark:disabled:text-gray-500
				${className}`}
				{...selectProps}
			>
				{children}
			</select>
		</div>
	);
};

export default Select;
