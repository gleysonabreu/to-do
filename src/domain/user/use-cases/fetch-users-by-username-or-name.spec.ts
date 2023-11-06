import { InMemoryUsersRepository } from '../../../../test/repositories/in-memory-users-repository';
import { makeUser } from '@test/factories/make-user';
import { FetchUsersByUsernameOrNameUseCase } from './fetch-users-by-username-or-name';

let sut: FetchUsersByUsernameOrNameUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Find Users By Username Or Name', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new FetchUsersByUsernameOrNameUseCase(inMemoryUsersRepository);
  });

  it('should be able to fetch users by username', async () => {
    const user = makeUser({ username: 'testing' });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({ usernameOrName: 'test' });

    expect(result.isRight()).toBe(true);
    expect(result.value.users).toHaveLength(1);
    expect(result.value.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: 'testing',
        }),
      ]),
    );
  });

  it('should be able to fetch users by first name', async () => {
    const user = makeUser({ firstName: 'testing' });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({ usernameOrName: 'test' });

    expect(result.isRight()).toBe(true);
    expect(result.value.users).toHaveLength(1);
    expect(result.value.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          firstName: 'testing',
        }),
      ]),
    );
  });

  it('should be able to fetch users by last name', async () => {
    const user = makeUser({ lastName: 'testing' });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({ usernameOrName: 'test' });

    expect(result.isRight()).toBe(true);
    expect(result.value.users).toHaveLength(1);
    expect(result.value.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          lastName: 'testing',
        }),
      ]),
    );
  });
});
