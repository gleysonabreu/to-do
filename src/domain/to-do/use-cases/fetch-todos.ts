import { Either, right } from '@/core/either';
import { Todo } from '../entities/todo';
import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../repositories/todo-repository';

interface FetchTodosUseCaseRequest {
  userId: string;
}

type FetchTodosUseCaseResponse = Either<
  null,
  {
    todos: Todo[];
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
