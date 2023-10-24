import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository';
import { makeUser } from '@test/factories/make-user';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { UpdateProfileUseCase } from './update-profile';

let sut: UpdateProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Update Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new UpdateProfileUseCase(inMemoryUsersRepository);
  });

  it('should be able to update profile if is public is true', async () => {
    const user = makeUser();
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      username: 'testing',
      isPublic: true,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.users[0].isPublic).toBeTruthy();
    expect(inMemoryUsersRepository.users[0].username).toEqual('testing');
  });

  it('should be able to update profile if is public is false', async () => {
    const user = makeUser();
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      username: 'testing',
      isPublic: false,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.users[0].isPublic).toBeFalsy();
    expect(inMemoryUsersRepository.users[0].username).toEqual('testing');
  });

  it('should not be able to update profile if user not exists', async () => {
    const result = await sut.execute({
      userId: 'any-id',
      username: 'testing',
      isPublic: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should be able to update the profile if the username is the same as the user', async () => {
    const user = makeUser({ username: 'testing' });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      username: 'testing',
      isPublic: true,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.users[0].isPublic).toBeTruthy();
    expect(inMemoryUsersRepository.users[0].username).toEqual('testing');
  });

  it('should not be able to update profile if username already exists', async () => {
    const user = makeUser();
    const userNewUsername = makeUser({ username: 'testing' });
    inMemoryUsersRepository.users.push(user);
    inMemoryUsersRepository.users.push(userNewUsername);

    const result = await sut.execute({
      userId: user.id.toString(),
      username: 'testing',
      isPublic: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
    expect(result.value).toEqual(new UserAlreadyExistsError('testing'));
  });
});
