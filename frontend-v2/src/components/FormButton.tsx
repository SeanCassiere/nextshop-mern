import React from "react";

const FormButton: React.FC<
	{ fullWidth?: true } & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = (props) => {
	const { children, className, fullWidth, ...buttonProps } = props;
	return (
		<button
			className={`
		${fullWidth && "block w-full"}
		p-3 text-md rounded-md font-semibold text-white bg-gray-800 disabled:bg-gray-500 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:cursor-not-allowed
    ${className}
    `}
			{...buttonProps}
		>
			{children}
		</button>
	);
};

export default FormButton;
