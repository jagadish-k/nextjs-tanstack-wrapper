import { ColumnDef, RowSelectionState, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

interface AppTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[] | ColumnDef<T, string>[];
  getRowId: (row: T) => string | number; // Function to extract a row's ID

  selectionMode?: 'none' | 'single' | 'multiple';
  onSelection?: (selected: T[]) => void;
}

const AppTable = <T extends object>({
  columns,
  data = [],
  selectionMode = 'none',
  onSelection,
  getRowId,
}: AppTableProps<T>) => {
  const [rowSelection, onRowSelectionChange] = useState<RowSelectionState>({});
  const mergedColumns: ColumnDef<T, string>[] =
    selectionMode === 'none'
      ? columns
      : [
          {
            id: 'selection',
            size: 20,
            header: ({ table }) =>
              selectionMode === 'multiple' ? (
                <input
                  type="checkbox"
                  name="select-all-rows"
                  {...{
                    checked: table.getIsAllRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                  }}
                />
              ) : null,
            cell: ({ row }) => (
              <>
                {selectionMode === 'multiple' ? (
                  <input
                    type="checkbox"
                    name={`select-row-${row.id}`}
                    {...{
                      checked: row.getIsSelected(),
                      disabled: !row.getCanSelect(),
                      onChange: row.getToggleSelectedHandler(),
                    }}
                  />
                ) : (
                  <input
                    type="radio"
                    name={`select-row-from-table`}
                    {...{
                      checked: row.getIsSelected(),
                      disabled: !row.getCanSelect(),
                      onChange: row.getToggleSelectedHandler(),
                    }}
                  />
                )}
              </>
            ),
          },
          ...columns,
        ];

  const { getHeaderGroups, getRowModel, getSelectedRowModel } = useReactTable<T>({
    columns: mergedColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => getRowId(row).toString(),

    state: {
      ...(selectionMode !== 'none' && { rowSelection }),
    },

    enableRowSelection: selectionMode !== 'none',
    enableMultiRowSelection: selectionMode === 'multiple',

    onRowSelectionChange,
    debugTable: false,
  });

  const headerGroups = getHeaderGroups();
  const rowModel = getRowModel();

  useEffect(() => {
    onSelection?.(getSelectedRowModel().rows.map((row) => row.original as T));
  }, [getSelectedRowModel, rowSelection, onSelection]);

  return (
    <table>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>;
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {rowModel && rowModel.rows.length > 0 ? (
          rowModel.rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headerGroups[0].headers.length}>
              <p>No data available</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AppTable;
