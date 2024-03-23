import { ColumnDef, RowData, RowSelectionState } from '@tanstack/react-table';

export interface AppTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[] | ColumnDef<T, string>[];

  availablePageSizes?: number[];
  pageSize?: number;
  pageIndex?: number;
  onPaginationChange?: (pageNumber: number, pageSize: number) => void;
  rowSelection?: RowSelectionState;
  onRowSelect?: (selected: T[]) => void;

  selectionMode?: 'none' | 'single' | 'multiple';

  selectedItems?: T[];

  clientSidePagination?: boolean;
  getRowId: (row: T) => string | number; // Function to extract a row's ID
}
