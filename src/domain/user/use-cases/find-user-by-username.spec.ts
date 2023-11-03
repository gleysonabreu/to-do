import { InMemoryUsersRepository } from '../../../../test/repositories/in-memory-users-repository';
import { makeUser } from '@test/factories/make-user';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { FindUserByUsernameUseCase } from './find-user-by-username';

let sut: FindUserByUsernameUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Find User By Username', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new FindUserByUsernameUseCase(inMemoryUsersRepository);
  });

  it('should not be able get a user if user not exists', async () => {
    const result = await sut.execute({ username: 'any-username' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should be able get a user', async () => {
    const user = makeUser({ username: 'test' });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({ username: 'test' });
    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0],
    });
  });
});
