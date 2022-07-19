import React from "react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from "@tanstack/react-table";
import { MdCheck, MdClose, MdEdit, MdDelete } from "react-icons/md";

import Table from "../../components/Table";
import Paginate from "../../components/Paginate";
import { adminDeleteUser, AdminDeleteUserDTO, getUsersForAdmin } from "../../api/admin";
import { useAuth } from "../../context/AuthContext";
import { UserFull } from "../../types/User";
import { LocationGenerics } from "../../App";
import { ResponseParsed } from "../../api/base";

const AdminUsers: React.FC<{}> = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { page = 1 } = useSearch<LocationGenerics>();
	const { user } = useAuth();
	const token = user?.token ?? "";

	const usersQuery = useQuery<ResponseParsed<UserFull[]>, any>(
		["admin", "users", page],
		() => getUsersForAdmin({ token, pageNumber: page }),
		{
			keepPreviousData: true,
		}
	);

	const { mutate: deleteUser } = useMutation<ResponseParsed<{ message: string }>, any, AdminDeleteUserDTO>(
		adminDeleteUser,
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["admin", "users"]);
			},
		}
	);

	const columnDefs: ColumnDef<UserFull>[] = [
		{
			header: "ID",
			accessorKey: "_id",
			cell: (info) => info.getValue(),
		},
		{
			header: "Full name",
			accessorKey: "name",
			cell: (info) => info.getValue(),
		},
		{
			header: "Email",
			accessorKey: "email",
			cell: (info) => info.getValue(),
		},
		{
			header: "Admin?",
			accessorKey: "isAdmin",
			cell: (info) => (info.getValue() ? <MdCheck className='text-green-500' /> : <MdClose className='text-red-500' />),
		},
		{
			header: "Actions",
			accessorFn: (row) => `${row._id} EDIT`,
			cell: (info) => {
				const value = info.getValue();
				const [id] = `${value}`.split(" ");
				return (
					<div className='flex gap-1'>
						<button
							onClick={() => {
								navigate({ to: `/admin/users/${id}` });
							}}
							className='px-2.5 py-2 text-red-100 transition-colors duration-150 bg-gray-700 rounded-sm focus:shadow-outline hover:bg-gray-800'
						>
							<MdEdit />
						</button>
						<button
							onClick={() => {
								if (window.confirm("Are you sure you want to delete this user?")) {
									deleteUser({ token, userId: id });
								}
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
					<h1 className='text-xl font-semibold text-gray-900'>Users</h1>
					<p className='mt-2 text-sm text-gray-700'>View and manage the users registered on the Nextshop platform.</p>
				</div>
				<div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>{/* Any right align add buttons go here */}</div>
			</div>
			<div className='pt-5'>
				{usersQuery.data && <Table rows={usersQuery.data.data ?? []} columnDefs={columnDefs} />}
				{usersQuery.data && usersQuery.data.totalPages > 1 && (
					<div className='py-4'>
						<Paginate page={page} pages={usersQuery.data.totalPages} to='/admin/users' />
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminUsers;
