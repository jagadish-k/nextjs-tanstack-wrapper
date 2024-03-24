import { Person } from '@app/types';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';

const personColumnHelper = createColumnHelper<Person>();

export const personsTableColumns: ColumnDef<Person, any>[] = [
  personColumnHelper.accessor('title', {
    header: 'Title',
  }),

  personColumnHelper.accessor('name', {
    header: 'Name',
  }),

  personColumnHelper.accessor('gender', {
    header: 'Gender',
  }),

  personColumnHelper.accessor('age', {
    header: 'Age',
  }),

  personColumnHelper.accessor('address', {
    header: 'Address',
  }),

  personColumnHelper.accessor('bio', {
    header: 'Bio',
  }),
];
