import React from "react";
import { useQuery } from "react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useLoadRoute, useSearch } from "@tanstack/react-location";
import { MdCheck, MdClose } from "react-icons/md";

import Table from "../../components/Table";
import Paginate from "../../components/Paginate";
import StyledLink from "../../components/StyledLink";
import { getOrdersForAdmin } from "../../api/admin";
import { useAuth } from "../../context/AuthContext";
import { formatPrice, formatShortDate } from "../../utils/format";
import { LocationGenerics } from "../../App";
import { Order } from "../../types/Order";
import { ResponseParsed } from "../../api/base";

const AdminOrders: React.FC<{}> = () => {
	const { page = 1 } = useSearch<LocationGenerics>();
	const { user } = useAuth();
	const token = user?.token ?? "";

	const loadRoute = useLoadRoute();

	const productsQuery = useQuery<ResponseParsed<Order[]>, any>(
		["admin", "orders", page],
		() => getOrdersForAdmin({ token, pageNumber: page }),
		{
			keepPreviousData: true,
		}
	);

	const columnDefs: ColumnDef<Order>[] = [
		{
			header: "ID",
			accessorKey: "_id",
			cell: (info) => {
				const value = info.getValue();
				return (
					<span>
						<StyledLink
							to={`/order/${value}`}
							onMouseEnter={() => {
								loadRoute({ to: `/order/${value}` });
							}}
						>
							{typeof value === "string" && value}
						</StyledLink>
					</span>
				);
			},
		},
		{
			header: "Customer",
			accessorFn: (row) => row.user.name,
			cell: (info) => info.getValue(),
		},
		{
			header: "Email",
			accessorFn: (row) => row.user.email,
			cell: (info) => info.getValue(),
		},
		{
			header: "Ordered on",
			accessorFn: (row) => row.createdAt,
			cell: (info) => formatShortDate(info.getValue()),
		},
		{
			header: "Total",
			accessorFn: (row) => row.totalPrice,
			cell: (info) => formatPrice(info.getValue()),
		},
		{
			header: "Paid?",
			accessorKey: "isPaid",
			cell: (info) => (info.getValue() ? <MdCheck className='text-green-500' /> : <MdClose className='text-red-500' />),
		},
		{
			header: "Delivered?",
			accessorKey: "isDeliver",
			cell: (info) => (info.getValue() ? <MdCheck className='text-green-500' /> : <MdClose className='text-red-500' />),
		},
	];

	return (
		<div>
			<div className='sm:flex sm:items-center'>
				<div className='sm:flex-auto'>
					<h1 className='text-xl font-semibold text-gray-900'>Orders</h1>
					<p className='mt-2 text-sm text-gray-700'>
						View and interact with the orders made by your customers on the Nextshop platform.
					</p>
				</div>
				<div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>{/* Any right align add buttons go here */}</div>
			</div>
			<div className='pt-5'>
				{productsQuery.data && <Table rows={productsQuery.data.data ?? []} columnDefs={columnDefs} />}
				{productsQuery.data && productsQuery.data.totalPages > 1 && (
					<div className='py-4'>
						<Paginate page={page} pages={productsQuery.data.totalPages} to='/admin/orders' />
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminOrders;
