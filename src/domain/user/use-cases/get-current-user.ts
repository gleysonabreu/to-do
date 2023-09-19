import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { Either, left, right } from '@/core/either';
import { User } from '../entities/user';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface GetCurrentUserUseCaseRequest {
  id: string;
}

type GetCurrentUserUseCaseResponse = Either<
  ResourceNotFoundError,
  { user: User }
>;

@Injectable()
export class GetCurrentUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
  }: GetCurrentUserUseCaseRequest): Promise<GetCurrentUserUseCaseResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    return right({ user });
  }
}
