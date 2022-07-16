import React from "react";

type ButtonSize = "sm" | "md" | "lg" | "xl";

const Button: React.FC<
	{ fullWidth?: true; size?: ButtonSize } & React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>
> = (props) => {
	const { children, className, fullWidth, size = "md", ...buttonProps } = props;
	return (
		<button
			className={`
		${fullWidth && "block w-full"}
		${size === "sm" && "px-4 py-2"}
		${size === "md" && "px-5 py-2.5"}
		${size === "lg" && "px-6 py-3"}
		${size === "xl" && "px-7 py-3.5"}
		duration-150
		text-md rounded-md font-semibold
		text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800
    disabled:bg-gray-500 disabled:cursor-not-allowed
		${className}
    `}
			{...buttonProps}
		>
			{children}
		</button>
	);
};

export default Button;
