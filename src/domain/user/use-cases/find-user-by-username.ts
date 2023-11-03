import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { Either, left, right } from '@/core/either';
import { User } from '../entities/user';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

type FindUserByUsernameUseCaseRequest = {
  username: string;
};

type FindUserByUsernameUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class FindUserByUsernameUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    username,
  }: FindUserByUsernameUseCaseRequest): Promise<FindUserByUsernameUseCaseResponse> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    return right({
      user: user,
    });
  }
}
