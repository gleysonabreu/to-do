import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../../../core/either';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { User } from '../entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { HashGenerator } from '../repositories/cryptography/hash-generator';

interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
}

type RegisterUserResponse = Either<UserAlreadyExistsError, { user: User }>;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashPassword: HashGenerator,
  ) {}

  async execute({
    email,
    firstName,
    lastName,
    password,
    username,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const userWithSameUsername =
      await this.usersRepository.findByUsername(username);

    if (userWithSameUsername) {
      return left(new UserAlreadyExistsError(username));
    }

    const passwordHash = await this.hashPassword.hash(password);

    const user = User.create({
      email,
      firstName,
      lastName,
      password: passwordHash,
      username,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
