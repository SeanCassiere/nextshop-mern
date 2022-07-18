import React from "react";
import { Link } from "@tanstack/react-location";

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
								? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
								: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
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
