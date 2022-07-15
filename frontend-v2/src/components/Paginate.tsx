import { Link } from "@tanstack/react-location";
import React from "react";

const Paginate: React.FC<{ page: number | string; pages: number; to?: string }> = ({ page, pages, to }) => {
	return (
		<div className='flex flex-row gap-1 py-4'>
			{[...Array.from(Array(pages).keys())]
				.map((num) => num + 1)
				.map((number) => (
					<Link
						to={to}
						key={`page${to && `-${to}`}-${number}`}
						className={`py-2 px-4 ${
							page === number ? "bg-blue-600 dark:bg-blue-800 text-white" : "bg-gray-200 dark:bg-gray-800"
						}`}
						search={{ page: number }}
					>
						{number}
					</Link>
				))}
		</div>
	);
};

export default Paginate;
