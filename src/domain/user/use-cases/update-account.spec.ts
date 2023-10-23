import { InMemoryUsersRepository } from '../../../../test/repositories/in-memory-users-repository';
import { makeUser } from '@test/factories/make-user';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { UpdateAccountUseCase } from './update-account';

let sut: UpdateAccountUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Update Account', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new UpdateAccountUseCase(inMemoryUsersRepository);
  });

  it('should be able to update account', async () => {
    const user = makeUser();
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      id: user.id.toString(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@hotmail.com',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0],
    });
  });

  it('should not be able to update account if user not exists', async () => {
    const result = await sut.execute({
      id: 'any-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@hotmail.com',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to update account if email already exists', async () => {
    const user = makeUser({ email: 'johndoe@hotmail.com' });
    const userLogged = makeUser();
    inMemoryUsersRepository.users.push(user);
    inMemoryUsersRepository.users.push(userLogged);

    const result = await sut.execute({
      id: userLogged.id.toString(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@hotmail.com',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
    expect(result.value).toEqual(
      new UserAlreadyExistsError('johndoe@hotmail.com'),
    );
  });

  it('should be able to update the account if the email is the same as the logged in user', async () => {
    const user = makeUser({ email: 'johndoe@hotmail.com' });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      id: user.id.toString(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@hotmail.com',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0],
    });
  });
});
