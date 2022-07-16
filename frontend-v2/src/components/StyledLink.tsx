import React from "react";
import { Link, LinkProps } from "@tanstack/react-location";

const StyledLink: React.FC<{} & LinkProps> = ({ children, ...others }) => {
	const { className, ...rest } = others;
	return (
		<Link
			className={`
    duration-150 text-indigo-600 hover:text-indigo-700 dark:text-indigo-600 dark:hover:text-indigo-500
    ${className}
    `}
			{...rest}
		>
			{children}
		</Link>
	);
};

export default StyledLink;
