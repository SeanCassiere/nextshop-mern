import React, { useId } from "react";

const FormSelect: React.FC<
	{ label?: string } & React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>
> = (props) => {
	const { label, className, children, ...selectProps } = props;
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
				px-5 py-3 
				border-2 text-md rounded-md
				bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-400 focus:border-blue-400
				dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-blue-700 dark:focus:border-blue-700
				${className}`}
				{...selectProps}
			>
				{children}
			</select>
		</div>
	);
};

export default FormSelect;
