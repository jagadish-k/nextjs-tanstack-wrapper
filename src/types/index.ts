export interface Person {
  id: string;
  title: string;
  name: string;
  age: number;
  gender: string;
  address: string;
  bio: string;
}

export interface TableAction {
  type: 'SELECT_RADIO_ITEM' | 'SELECT_CHECKBOX_ITEM';
  payload: any;
}

export interface PageTableSelectionState {
  selectedRadioItem: Person;
  selectedCheckBoxItems: Person[];
}
