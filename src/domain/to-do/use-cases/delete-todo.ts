import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../repositories/todo-repository';

interface DeleteTodoUseCaseRequest {
  userId: string;
  todoId: string;
}

type DeleteTodoUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

@Injectable()
export class DeleteTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute({
    todoId,
    userId,
  }: DeleteTodoUseCaseRequest): Promise<DeleteTodoUseCaseResponse> {
    const todo = await this.todoRepository.findById(todoId);

    if (!todo) {
      return left(new ResourceNotFoundError());
    }

    if (todo.userId.toString() !== userId) {
      return left(new NotAllowedError());
    }

    await this.todoRepository.delete(todo);
    return right(null);
  }
}
