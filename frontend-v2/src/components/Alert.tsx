import React from "react";

const Alert: React.FC<{
	label: string;
	message?: string;
	variant?: "info" | "danger" | "success" | "warning";
	children?: React.ReactNode;
}> = ({ label, variant = "info", message, children }) => {
	let textColor = "text-blue-700 dark:text-blue-800";
	let bgColor = "bg-blue-100 dark:bg-blue-200";

	if (variant === "danger") {
		textColor = "text-red-700 dark:text-red-800";
		bgColor = "bg-red-100 dark:bg-red-200";
	}

	if (variant === "warning") {
		textColor = "text-orange-700 dark:text-orange-800";
		bgColor = "bg-orange-100 dark:bg-orange-200";
	}

	if (variant === "success") {
		textColor = "text-green-700 dark:text-green-800";
		bgColor = "bg-green-100 dark:bg-green-200";
	}
	return (
		<div className={`p-4 mb-4 text-sm ${textColor} rounded-md ${bgColor}`} role='alert'>
			<span className='font-medium text-lg'>{label}</span>
			{message && message?.length > 0 && <>&nbsp;{message}</>}
			{children && <div className='pt-2'>{children}</div>}
		</div>
	);
};

export default Alert;
