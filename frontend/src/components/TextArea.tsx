import React, { useId } from "react";

type TextAreaSize = "sm" | "md" | "lg" | "xl";

const TextArea: React.FC<
	{ label?: string; size?: TextAreaSize } & React.DetailedHTMLProps<
		React.TextareaHTMLAttributes<HTMLTextAreaElement>,
		HTMLTextAreaElement
	>
> = (props) => {
	const { label, className, size = "md", ...textareaProps } = props;
	const elementId = useId();
	return (
		<div className='flex flex-col relative gap-1'>
			{label && (
				<label className='text-md' htmlFor={elementId}>
					{label}
				</label>
			)}
			<textarea
				id={elementId}
				className={`
				${size === "sm" && "px-4 py-2"}
				${size === "md" && "px-5 py-2.5"}
				${size === "lg" && "px-6 py-3"}
				${size === "xl" && "px-7 py-3.5"}
				border border-gray-200 text-md rounded-md shadow-sm
				text-gray-900 focus:ring-indigo-400 focus:border-indigo-400
				disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400
				${className}`}
				{...textareaProps}
			/>
		</div>
	);
};

export default TextArea;
