import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../repositories/todo-repository';
import { TodoDetails } from '../entities/value-objects/todo-details';

interface FetchTodosUseCaseRequest {
  userId: string;
}

type FetchTodosUseCaseResponse = Either<
  null,
  {
    todos: TodoDetails[];
  }
>;

@Injectable()
export class FetchTodosUseCase {
  constructor(private todosRepository: TodoRepository) {}

  async execute({
    userId,
  }: FetchTodosUseCaseRequest): Promise<FetchTodosUseCaseResponse> {
    const todos = await this.todosRepository.getTodosByUserId(userId);

    return right({
      todos,
    });
  }
}
