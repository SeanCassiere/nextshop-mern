import { Link } from "@tanstack/react-location";
import React from "react";

const Paginate: React.FC<{ page: number | string; pages: number; to?: string }> = ({ page, pages, to }) => {
	return (
		<nav className='relative z-0 inline-flex rounded-md -space-x-px' aria-label='Pagination'>
			{[...Array.from(Array(pages).keys())]
				.map((num) => num + 1)
				.map((number) => (
					<Link
						to={to}
						key={`page${to && `-${to}`}-${number}`}
						className={`${
							page === number
								? "z-10 bg-blue-50 dark:bg-blue-700 border-blue-500 dark:border-blue-900 text-blue-600 dark:text-blue-100 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
								: "bg-white dark:bg-blue-900 border-gray-300 dark:border-gray-900 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
						}`}
						search={{ page: number }}
					>
						{number}
					</Link>
				))}
		</nav>
	);
};

export default Paginate;
