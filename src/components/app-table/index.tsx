import {
  Checkbox,
  Radio,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableProps,
  TableRow,
  Typography,
} from '@mui/material';
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
import { useEffect, useState } from 'react';
import { getRowSelectionState, getCellProps } from './utils';
import { CustomFooter } from './footer';
import { AppTableProps } from './types';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    type: string;
  }
}

const AppTable = <T extends object>({
  columns,
  data = [],
  selectionMode = 'none',
  pageSize = 5,
  pageIndex = 0,
  onPaginationChange,
  availablePageSizes = [5, 15, 30],
  selectedItems = [],
  onRowSelect,
  clientSidePagination = false,
  getRowId,
}: AppTableProps<T>) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
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
                <Checkbox
                  name="select-all-rows"
                  {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                  }}
                />
              ) : null,
            cell: ({ row }) => (
              <>
                {selectionMode === 'multiple' ? (
                  <Checkbox
                    name={`select-row-${row.id}`}
                    {...{
                      checked: row.getIsSelected(),
                      disabled: !row.getCanSelect(),
                      onChange: row.getToggleSelectedHandler(),
                    }}
                  />
                ) : (
                  <Radio
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

    onRowSelectionChange: setRowSelection,

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

  useEffect(() => {
    onRowSelect?.(getSelectedRowModel().rows.map((row) => row.original as T));
  }, [getSelectedRowModel, onRowSelect, rowSelection]);

  useEffect(() => {
    if (rowModel.flatRows.length && selectedItems.length) {
      setRowSelection((prev) => {
        const selection = getRowSelectionState(selectedItems, rowModel.flatRows, getRowId);
        console.log(selectedItems, data, selection);

        return selection;
      });
    }
  }, [data, getRowId, rowModel.flatRows, selectedItems]);

  return (
    <TableContainer sx={{ minHeight: '150px' }}>
      <Table aria-label="tryft data table" data-testid="tryft-data-table">
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableCell
                    key={header.id}
                    align={
                      header.column.columnDef.meta?.type === 'number' ||
                      header.column.columnDef.meta?.type === 'currency'
                        ? 'right'
                        : 'left'
                    }
                    width={header.getSize()}
                    sx={{
                      color: '#6FA2BF',
                      fontWeight: 400,
                      fontSize: '18px',
                      lineHeight: '22px',
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rowModel && rowModel.rows.length > 0 ? (
            rowModel.rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    align={
                      cell.column.columnDef.meta?.type === 'number' || cell.column.columnDef.meta?.type === 'currency'
                        ? 'right'
                        : 'left'
                    }
                    {...getCellProps(cell.getContext())}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headerGroups[0].headers.length}>
                <Typography variant="h6" align="center">
                  No data available
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={clientSidePagination ? headerGroups[0].headers.length - 1 : headerGroups[0].headers.length}
            >
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
                handlePageSizeChange={(event: SelectChangeEvent<number>) => {
                  setPagination({ pageIndex: clientSidePagination ? 0 : 1, pageSize: event.target.value as number });
                }}
                pageSize={pagination.pageSize}
                availablePageSizes={availablePageSizes}
              />
            </TableCell>
            {clientSidePagination && (
              <TableCell align="right">
                <Typography variant="caption" mx={'6px'}>
                  {data.length} rows
                </Typography>
              </TableCell>
            )}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default AppTable;
