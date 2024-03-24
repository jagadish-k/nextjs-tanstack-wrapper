import {
  ColumnDef,
  PaginationState,
  RowData,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { getRowSelectionState } from './utils';
import { CustomFooter } from './footer';
import { AppTableProps } from './types';

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
    pageSize = 5,
    pageIndex = 0,
    onPaginationChange,
    availablePageSizes = [5, 15, 30],
    selectedItems = [],
    rowSelection,
    setRowSelection,
    // onRowSelect,
    clientSidePagination = false,
    getRowId,
  } = props;

  // const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
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

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex,
    pageSize,
  });

  const {
    getHeaderGroups,
    getRowModel,
    getSelectedRowModel,
    nextPage,
    previousPage,
    getCanNextPage,
    getCanPreviousPage,
  } = useReactTable<T>({
    columns: mergedColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    getRowId: (row) => getRowId(row).toString(),

    state: {
      sorting,
      pagination,
      ...(selectionMode !== 'none' && { rowSelection }),
    },

    enableRowSelection: selectionMode !== 'none',
    enableMultiRowSelection: selectionMode === 'multiple',

    onSortingChange: setSorting,

    onRowSelectionChange: setRowSelection as any,

    manualPagination: false,
    onPaginationChange: setPagination,

    debugTable: false,
  });

  const headerGroups = getHeaderGroups();
  const rowModel = getRowModel();
  const hasMoreData = data.length == pageSize;

  useEffect(() => {
    onPaginationChange?.(pagination.pageIndex, pagination.pageSize);
  }, [onPaginationChange, pagination]);

  // useEffect(() => {
  //   onRowSelect?.(getSelectedRowModel().rows.map((row) => row.original as T));
  // }, [getSelectedRowModel, onRowSelect, rowSelection]);

  // useEffect(() => {
  //   if (rowModel.flatRows.length && selectedItems.length) {
  //     setRowSelection((prev) => {
  //       const selection = getRowSelectionState(selectedItems, rowModel.flatRows, getRowId);
  //       console.log(selectedItems, data, selection);

  //       return selection;
  //     });
  //   }
  // }, [data, getRowId, rowModel.flatRows, selectedItems]);

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
      <tfoot>
        <tr>
          <td colSpan={clientSidePagination ? headerGroups[0].headers.length - 1 : headerGroups[0].headers.length}>
            <CustomFooter
              currentPage={clientSidePagination ? pagination.pageIndex + 1 : pageIndex}
              enablePrev={!clientSidePagination ? pageIndex === 0 : getCanPreviousPage()}
              handlePrev={() => {
                previousPage();
              }}
              enableNext={!clientSidePagination ? hasMoreData : getCanNextPage()}
              handleNext={() => {
                nextPage();
              }}
              handlePageSizeChange={(event) => {
                setPagination({ pageIndex: clientSidePagination ? 0 : 1, pageSize: parseInt(event.target.value) });
              }}
              pageSize={pagination.pageSize}
              availablePageSizes={availablePageSizes}
            />
          </td>
          {clientSidePagination && (
            <td align="right">
              <span>{data.length} rows</span>
            </td>
          )}
        </tr>
      </tfoot>
    </table>
  );
};

export default AppTable;
