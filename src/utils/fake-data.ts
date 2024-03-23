import { Person, Title } from '@app/types';
import { faker } from '@faker-js/faker';

export const makeFakePeople = (): Person => ({
  id: faker.string.uuid(),
  title: faker.helpers.arrayElement(Object.values(Title)),
  age: faker.number.int({
    min: 18,
    max: 100,
  }),
  name: faker.person.fullName(),
  gender: faker.person.gender(),
  bio: faker.person.bio(),
  address: faker.location.streetAddress(),
});
