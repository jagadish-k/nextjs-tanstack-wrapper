import {
  ColumnDef,
  PaginationState,
  RowData,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { AppTableProps } from './types';
import React from 'react';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    type: string;
  }
}

const AppTable = <T extends object>(props: AppTableProps<T>) => {
  const {
    columns,
    data = [],
    selectionMode = 'none',
    selectedItems = [],
    // rowSelection,
    // setRowSelection,
    onSelection,
    getRowId,
  } = props;

  const [rowSelection, onRowSelectionChange] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
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
                    // indeterminate: table.getIsSomeRowsSelected(),
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
                    name={`select-row-${row.id}`}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSelectedRowModel, rowSelection]);

  return (
    <table
      style={{
        borderCollapse: 'collapse',
        margin: '10px 0',
      }}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th
                  key={header.id}
                  align={
                    header.column.columnDef.meta?.type === 'number' || header.column.columnDef.meta?.type === 'currency'
                      ? 'right'
                      : 'left'
                  }
                  style={{
                    color: '#6FA2BF',
                    fontWeight: 400,
                    fontSize: '18px',
                    lineHeight: '22px',
                    border: '1px solid grey',
                    padding: '10px 15px',
                    width: header.getSize(),
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {rowModel && rowModel.rows.length > 0 ? (
          rowModel.rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    padding: '10px 15px',
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
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

export default React.memo(AppTable);
