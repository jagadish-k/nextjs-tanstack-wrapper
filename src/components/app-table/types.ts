import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { ChangeEventHandler } from 'react';

export interface AppTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[] | ColumnDef<T, string>[];

  availablePageSizes?: number[];
  pageSize?: number;
  pageIndex?: number;
  onPaginationChange?: (pageNumber: number, pageSize: number) => void;
  rowSelection?: RowSelectionState;
  setRowSelection?: (rowSelection: RowSelectionState) => void;
  onRowSelect?: (selected: T[]) => void;

  selectionMode?: 'none' | 'single' | 'multiple';

  selectedItems?: T[];

  clientSidePagination?: boolean;
  getRowId: (row: T) => string | number; // Function to extract a row's ID
}

export interface CustomFooterProps {
  handlePrev?: () => void;
  currentPage: number;
  handleNext?: () => void;
  availablePageSizes?: number[];
  pageSize?: number;
  handlePageSizeChange: ChangeEventHandler<HTMLSelectElement>;
  enableNext?: boolean;
  enablePrev?: boolean;
}
