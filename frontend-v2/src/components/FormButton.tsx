import React from "react";

const FormButton: React.FC<
	{} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = (props) => {
	const { children, className, ...buttonProps } = props;
	return (
		<button
			className={`
    text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
    ${className}
    `}
			{...buttonProps}
		>
			{children}
		</button>
	);
};

export default FormButton;
