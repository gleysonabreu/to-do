import { InMemoryUsersRepository } from '../../../../test/repositories/in-memory-users-repository';
import { makeUser } from '@test/factories/make-user';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { GetCurrentUserUseCase } from './get-current-user';

let sut: GetCurrentUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Get Current User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetCurrentUserUseCase(inMemoryUsersRepository);
  });

  it('should not be able get a user if user not exists', async () => {
    const result = await sut.execute({ id: 'any-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should be able get a user', async () => {
    const user = makeUser();
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({ id: user.id.toString() });
    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0],
    });
  });
});
