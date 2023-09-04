import { RegisterUserUseCase } from './register-user';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { makeUser } from '../../../../test/factories/make-user';
import { InMemoryUsersRepository } from '../../../../test/repositories/in-memory-users-repository';
import { FakeHash } from '../../../../test/repositories/cryptography/fake-hash';

let sut: RegisterUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHash: FakeHash;

describe('Register User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHash = new FakeHash();
    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHash);
  });

  it('should be able to register a new user', async () => {
    const result = await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@hotmail.com',
      password: '1234',
      username: 'johndoe',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0],
    });
  });

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@hotmail.com',
      password: '123456',
      username: 'johndoe',
    });

    const passwordHash = await fakeHash.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.users[0].password).toEqual(passwordHash);
  });

  it('should not be able to create register a new user if email already exists', async () => {
    const fakeUser = makeUser();
    inMemoryUsersRepository.users.push(fakeUser);

    const result = await sut.execute(fakeUser);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
    expect(result.value).toEqual(new UserAlreadyExistsError(fakeUser.email));
  });

  it('should not be able to create register a new user if username already exists', async () => {
    const fakeUser = makeUser();
    inMemoryUsersRepository.users.push(fakeUser);

    const result = await sut.execute({
      firstName: fakeUser.firstName,
      lastName: fakeUser.firstName,
      email: 'johndoe@hotmail.com',
      password: fakeUser.password,
      username: fakeUser.username,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
    expect(result.value).toEqual(new UserAlreadyExistsError(fakeUser.username));
  });
});
