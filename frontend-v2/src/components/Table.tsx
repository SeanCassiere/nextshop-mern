import React, { useId } from "react";

export type TableElement = {};

interface TableColumn<T> {
	name: string;
	renderValue: (row: T) => React.ReactNode;
	width?: number;
}

export interface TableModel<T> {
	columns: TableColumn<T>[];
}

interface Props<T> {
	model: TableModel<T>;
	items: T[];
	emptyMessage?: string;
}

const GenericTable = <T,>({ items, model, emptyMessage }: Props<T>) => {
	const idString = useId();

	return (
		<div className='overflow-x-auto rounded-sm'>
			<table className='table-auto w-full'>
				<thead className='text-md font-semibold uppercase text-gray-400 dark:text-gray-300 bg-gray-100 dark:bg-gray-700'>
					<tr>
						{model.columns.map((col, idx) => (
							<th key={`${idString}-${idx}-${col.name}`} className='p-2 whitespace-nowrap'>
								<div className='font-semibold text-left'>{col.name}</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{items.length === 0 ? (
						<tr key={`${idString}-empty-row`} className='dark:bg-gray-900'>
							<td key={`${idString}-empty-row-cell`} colSpan={model.columns.length} className='p-2 whitespace-nowrap'>
								<div className='text-center'>{emptyMessage ? emptyMessage : "No data"}</div>
							</td>
						</tr>
					) : (
						items.map((row, idx) => (
							<tr
								key={`${idString}-${idx}`}
								className={`${idx % 2 === 0 ? "dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}`}
							>
								{model.columns.map((config, colIdx) => (
									<td key={`${idString}-${colIdx}-${config.name}`} className='p-2 whitespace-nowrap'>
										<div className='text-left text-md'>{config.renderValue(row)}</div>
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default React.memo(GenericTable);
