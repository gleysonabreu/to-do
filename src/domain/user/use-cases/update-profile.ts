import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { UsersRepository } from '../repositories/users-repository';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';

type UpdateProfileUseCaseRequest = {
  username: string;
  isPublic: boolean;
  userId: string;
};

type UpdateProfileUseCaseResponse = Either<
  ResourceNotFoundError | UserAlreadyExistsError,
  null
>;

@Injectable()
export class UpdateProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    isPublic,
    username,
    userId,
  }: UpdateProfileUseCaseRequest): Promise<UpdateProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    if (user.username !== username) {
      const findUserByUsername =
        await this.usersRepository.findByUsername(username);
      if (findUserByUsername) {
        return left(new UserAlreadyExistsError(username));
      }
    }

    if (isPublic) {
      user.enableProfile();
    } else {
      user.disableProfile();
    }

    user.username = username;
    await this.usersRepository.save(user);

    return right(null);
  }
}
