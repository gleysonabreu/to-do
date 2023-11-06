import { Either, right } from '@/core/either';
import { UsersRepository } from '../repositories/users-repository';
import { User } from '../entities/user';
import { Injectable } from '@nestjs/common';

type FetchUsersByUsernameOrNameRequest = {
  usernameOrName: string;
};

type FetchUsersByUsernameOrNameResponse = Either<
  null,
  {
    users: User[];
  }
>;

@Injectable()
export class FetchUsersByUsernameOrNameUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    usernameOrName,
  }: FetchUsersByUsernameOrNameRequest): Promise<FetchUsersByUsernameOrNameResponse> {
    const users =
      await this.usersRepository.findManyUsersByUsernameOrName(usernameOrName);

    return right({ users });
  }
}
