import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { TodoItemRepository } from '../repositories/todo-item-repository';
import { TodoRepository } from '../repositories/todo-repository';
import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DeleteTodoItemUseCaseRequest {
  userId: string;
  todoItemId: string;
}

type DeleteTodoItemUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteTodoItemUseCase {
  constructor(
    private todoItemRepository: TodoItemRepository,
    private todoRepository: TodoRepository,
  ) {}

  async execute({
    todoItemId,
    userId,
  }: DeleteTodoItemUseCaseRequest): Promise<DeleteTodoItemUseCaseResponse> {
    const todoItem = await this.todoItemRepository.findById(todoItemId);
    if (!todoItem) {
      return left(new ResourceNotFoundError());
    }

    const todo = await this.todoRepository.findById(todoItem.todoId.toString());
    if (!todo) {
      return left(new ResourceNotFoundError());
    }

    if (todo.userId.toString() !== userId) {
      return left(new NotAllowedError());
    }

    await this.todoItemRepository.delete(todoItemId);

    return right(null);
  }
}
