import React, { useId } from "react";

const Checkbox: React.FC<
	{ label?: string } & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = (props) => {
	const { label, ...inputProps } = props;
	const elementId = useId();
	return (
		<div className='flex items-center'>
			<input
				id={elementId}
				type='checkbox'
				className='h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:cursor-not-allowed disabled:text-gray-400'
				{...inputProps}
			/>
			{label && (
				<label htmlFor={elementId} className='ml-2 block text-md text-gray-900'>
					{label}
				</label>
			)}
		</div>
	);
};

export default Checkbox;
