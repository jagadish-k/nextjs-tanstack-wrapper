import { Box, Container, Drawer, Paper, Typography } from '@mui/material';
import Head from 'next/head';

import { makeFakePeople } from '@app/utils/fake-data';
import AppTable from '@app/components/app-table';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Person } from '@app/types';
import { useEffect, useReducer, useState } from 'react';

const personColumnHelper = createColumnHelper<Person>();

const columns: ColumnDef<Person, any>[] = [
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

interface TableAction {
  type: 'SELECT_RADIO_ITEM' | 'SELECT_CHECKBOX_ITEM';
  payload: any;
}

interface PageTableSelectionState {
  selectedRadioItem: Person;
  selelectedCheckboxItems: Person[];
}

const stateReducer = (state: PageTableSelectionState, action: TableAction) => {
  switch (action.type) {
    case 'SELECT_RADIO_ITEM':
      return {
        ...state,
        selectedRadioItem: action.payload,
      };
    case 'SELECT_CHECKBOX_ITEM':
      return {
        ...state,
        selelectedCheckboxItems: [...action.payload],
      };

    default:
      return state;
  }
  return state;
};

export default function Home() {
  const [state, dispatch] = useReducer(stateReducer, {
    selectedRadioItem: null,
    selelectedCheckboxItems: [],
  });

  const [fakePersons, setFakePersons] = useState<Person[]>([]);
  useEffect(() => {
    const fakePeople = Array.from({ length: 100 }, () => makeFakePeople());
    setFakePersons(fakePeople);
  }, []);
  return (
    <>
      <Head>
        <title>Tanstack Wrapper</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container maxWidth="lg">
          <Box
            sx={{
              my: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
              Material UI - Next.js Tanstack Table Wrapper example in TypeScript
            </Typography>
          </Box>
          <Box
            sx={{
              my: 4,
            }}
          >
            <AppTable
              data={fakePersons}
              columns={columns}
              getRowId={(row) => row.id}
              clientSidePagination={true}
              pageSize={5}
            />
          </Box>
          <Box
            sx={{
              my: 4,
            }}
          >
            <AppTable
              data={fakePersons}
              columns={columns}
              getRowId={(row) => row.id}
              clientSidePagination={true}
              pageSize={5}
              selectionMode="single"
              onRowSelect={(items: Person[]) => {}}
            />
          </Box>
          <Box
            sx={{
              my: 4,
            }}
          >
            <AppTable
              data={fakePersons}
              columns={columns}
              getRowId={(row) => row.id}
              clientSidePagination={true}
              pageSize={5}
              selectionMode="multiple"
            />
          </Box>
          <Drawer
            variant="permanent"
            anchor="right"
            sx={{
              'padding': 1,
              'width': 400,
              'flexShrink': 0,
              '& .MuiDrawer-paper': {
                width: 400,
                boxSizing: 'border-box',
              },
            }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" component="h1" sx={{ mb: 2 }}>
                Selected Radio Item
              </Typography>
              <pre>{JSON.stringify(state.selectedRadioItem, null, 2)}</pre>
              <Typography variant="h6" component="h1" sx={{ mb: 2 }}>
                Selected Checkbox Items
              </Typography>
              <pre>{JSON.stringify(state.selelectedCheckboxItems, null, 2)}</pre>
            </Paper>
          </Drawer>
        </Container>
      </main>
    </>
  );
}
