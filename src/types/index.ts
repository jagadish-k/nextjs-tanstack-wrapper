export enum Title {
  Mr = 'Mr',
  Mrs = 'Mrs',
  Ms = 'Ms',
  Miss = 'Miss',
  Dr = 'Dr',
  Prof = 'Prof',
  Rev = 'Rev',
}

export interface Person {
  id: string;
  title: Title;
  name: string;
  age: number;
  gender: string;
  address: string;
  bio: string;
}
