import React from "react";

const Alert: React.FC<{
	label: string;
	message?: string;
	variant?: "info" | "danger" | "success" | "warning";
	children?: React.ReactNode;
}> = ({ label, variant = "info", message, children }) => {
	let textColor = "text-blue-700";
	let bgColor = "bg-blue-100";

	if (variant === "danger") {
		textColor = "text-red-700";
		bgColor = "bg-red-100";
	}

	if (variant === "warning") {
		textColor = "text-orange-700";
		bgColor = "bg-orange-100";
	}

	if (variant === "success") {
		textColor = "text-green-700";
		bgColor = "bg-green-100";
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
