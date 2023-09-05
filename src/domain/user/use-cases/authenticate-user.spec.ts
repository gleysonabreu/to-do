import { InMemoryUsersRepository } from '../../../../test/repositories/in-memory-users-repository';
import { AuthenticateUserUseCase } from './authenticate-user';
import { FakeHash } from '../../../../test/repositories/cryptography/fake-hash';
import { makeUser } from '../../../../test/factories/make-user';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { FakeEncrypt } from '../../../../test/repositories/cryptography/fake-encrypt';

let sut: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHash: FakeHash;
let encrypt: FakeEncrypt;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHash = new FakeHash();
    encrypt = new FakeEncrypt();
    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHash,
      encrypt,
    );
  });

  it('should be able to authenticate a user', async () => {
    const user = makeUser({
      email: 'johndoe@exemple.com',
      password: await fakeHash.hash('123456'),
    });

    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should not be able to authenticate a user if is password wrong', async () => {
    const user = makeUser();
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      email: user.email,
      password: '12345',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
    expect(result.value).toEqual(new WrongCredentialsError());
  });

  it('should not be able to authenticate a user if is email wrong', async () => {
    const user = makeUser({
      password: await fakeHash.hash('123456'),
    });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      email: 'wrong-email@exemple.com',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
    expect(result.value).toEqual(new WrongCredentialsError());
  });
});
