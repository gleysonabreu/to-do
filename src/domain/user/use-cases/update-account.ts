import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '../repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { User } from '../entities/user';

type UpdateAccountUseCaseRequest = {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
};

type UpdateAccountUseCaseResponse = Either<
  UserAlreadyExistsError | ResourceNotFoundError,
  { user: User }
>;

@Injectable()
export class UpdateAccountUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    email,
    firstName,
    lastName,
  }: UpdateAccountUseCaseRequest): Promise<UpdateAccountUseCaseResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    if (user.email !== email) {
      const findUserByEmail = await this.usersRepository.findByEmail(email);
      if (findUserByEmail) {
        return left(new UserAlreadyExistsError(email));
      }
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    await this.usersRepository.save(user);

    return right({ user });
  }
}
