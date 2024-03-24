import { ColumnDef, RowSelectionState } from '@tanstack/react-table';

export interface AppTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[] | ColumnDef<T, string>[];
  getRowId: (row: T) => string | number; // Function to extract a row's ID

  selectionMode?: 'none' | 'single' | 'multiple';
  onSelection?: (selected: T[]) => void;
}
