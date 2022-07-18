import React from "react";
import { useQuery } from "react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useLoadRoute, useSearch } from "@tanstack/react-location";
import { MdEdit, MdDelete } from "react-icons/md";

import Table from "../../components/Table";
import Paginate from "../../components/Paginate";
import StyledLink from "../../components/StyledLink";
import { getProductsForAdmin } from "../../api/admin";
import { useAuth } from "../../context/AuthContext";
import { Product } from "../../types/Product";
import { formatPrice } from "../../utils/format";
import { LocationGenerics } from "../../App";

const AdminProducts: React.FC<{}> = () => {
	const { page = 1 } = useSearch<LocationGenerics>();
	const { user } = useAuth();
	const token = user?.token ?? "";

	const loadRoute = useLoadRoute();

	const productsQuery = useQuery<{ data: Product[]; page: number; pages: number }, any>(
		["admin", "products", `page-${page}`],
		() => getProductsForAdmin({ token, pageNumber: page }),
		{
			keepPreviousData: true,
		}
	);

	const columnDefs: ColumnDef<Product>[] = [
		{
			header: "ID",
			accessorKey: "_id",
			cell: (info) => {
				const value = info.getValue();
				return (
					<span>
						<StyledLink
							to={`/products/${value}`}
							onMouseEnter={() => {
								loadRoute({ to: `/products/${value}` });
							}}
						>
							{typeof value === "string" && value}
						</StyledLink>
					</span>
				);
			},
		},
		{
			header: "Name",
			accessorKey: "name",
			cell: (info) => info.getValue(),
		},
		{
			header: "Price",
			accessorKey: "price",
			cell: (info) => formatPrice(info.getValue()),
		},
		{
			header: "Category",
			accessorKey: "category",
			cell: (info) => info.getValue(),
		},
		{
			header: "Brand",
			accessorKey: "brand",
			cell: (info) => info.getValue(),
		},
		{
			header: "Actions",
			accessorFn: (row) => `${row._id} EDIT`,
			cell: (info) => {
				const value = info.getValue();
				return (
					<div className='flex gap-1'>
						<button
							onClick={() => {
								const [id] = `${value}`.split(" ");
								console.log(id);
							}}
							className='px-2.5 py-2 text-red-100 transition-colors duration-150 bg-gray-700 rounded-sm focus:shadow-outline hover:bg-gray-800'
						>
							<MdEdit />
						</button>
						<button
							onClick={() => {
								const [id] = `${value}`.split(" ");
								console.log(id);
							}}
							className='px-2.5 py-2 text-gray-100 transition-colors duration-150 bg-red-700 rounded-sm focus:shadow-outline hover:bg-red-800'
						>
							<MdDelete />
						</button>
					</div>
				);
			},
		},
	];

	return (
		<div>
			<div className='sm:flex sm:items-center'>
				<div className='sm:flex-auto'>
					<h1 className='text-xl font-semibold text-gray-900'>Products</h1>
					<p className='mt-2 text-sm text-gray-700'>
						Organize and manage the your inventory of products on the Nextshop platform.
					</p>
				</div>
				<div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
					<button
						type='button'
						className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto'
					>
						Add product
					</button>
				</div>
			</div>
			<div className='pt-5'>
				{productsQuery.data && <Table rows={productsQuery.data?.data ?? []} columnDefs={columnDefs} />}
				{productsQuery.data && productsQuery.data.pages > 1 && (
					<div className='py-4'>
						<Paginate page={page} pages={productsQuery.data.pages} to='/admin/products' />
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminProducts;
