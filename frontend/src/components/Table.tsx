import React from "react";
import { ColumnDef, getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table";

interface Props<T> {
	rows: T[];
	columnDefs: ColumnDef<any>[];
}

const TanStackTable = <T extends any>(props: React.PropsWithChildren<Props<T>>) => {
	const table = useReactTable({
		data: props.rows,
		columns: props.columnDefs,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className='overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-md'>
			<table className='min-w-full table-auto divide-y divide-gray-300'>
				<thead className='bg-gray-50'>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id} className='divide-x divide-gray-200'>
							{headerGroup.headers.map((header, headerIdx) => (
								<th
									key={header.id}
									scope='col'
									className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 ${
										headerIdx === 0 ? "sm:pl-6" : undefined
									}`}
								>
									{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody className='bg-white divide-y divide-gray-200'>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id} className='divide-x divide-gray-200'>
							{row.getVisibleCells().map((cell, cellIdx) => (
								<td
									key={cell.id}
									className={`whitespace-nowrap py-4 text-sm font-normal text-gray-700 ${
										cellIdx === 0 ? "pl-4 pr-3 sm:pl-6" : "px-3 "
									}`}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default React.memo(TanStackTable);
