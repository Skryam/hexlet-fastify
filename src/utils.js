import { faker } from '@faker-js/faker';

const createRandomCourse = () => ({
  id: faker.string.uuid(),
  coursename: faker.commerce.productName(),
  description: faker.lorem.sentence(),
});

export default () => {
  faker.seed(123);
  return faker.helpers.multiple(createRandomCourse, {
    count: 10,
  });
};
