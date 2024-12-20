import { faker } from '@faker-js/faker';
import CryptoJS from 'crypto-js';

export const crypto = (password) => CryptoJS.SHA256(password);
export const generateId = () => faker.string.uuid();

const createRandomUser = () => ({
  name: faker.internet.userName().trim(),
  email: faker.internet.email().toLowerCase().trim(),
  password: crypto(faker.internet.password()),
});

export const getUsers = () => {
  faker.seed(123);
  return faker.helpers.multiple(createRandomUser, {
    count: 100,
  });
};

const createRandomCourse = () => ({
  coursename: faker.commerce.productName(),
  description: faker.lorem.sentence(),
});

export default () => {
  faker.seed(123);
  return faker.helpers.multiple(createRandomCourse, {
    count: 10,
  });
};
