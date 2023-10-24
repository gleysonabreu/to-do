import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id';
import { User, UserProps } from '../../src/domain/user/entities/user';

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
      username: faker.internet.userName(),
      isPublic: faker.datatype.boolean(),
      ...override,
    },
    id,
  );

  return user;
}
