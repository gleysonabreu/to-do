import { Injectable } from '@nestjs/common';
import { TodoItemRepository } from '../repositories/todo-item-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { TodoRepository } from '../repositories/todo-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DoneTodoItemUseCaseRequest {
  userId: string;
  todoItemId: string;
}

type DoneTodoItemUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DoneTodoItemUseCase {
  constructor(
    private todoItemRepository: TodoItemRepository,
    private todoRepository: TodoRepository,
  ) {}

  async execute({
    userId,
    todoItemId,
  }: DoneTodoItemUseCaseRequest): Promise<DoneTodoItemUseCaseResponse> {
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

    todoItem.done();
    await this.todoItemRepository.save(todoItem);

    return right(null);
  }
}
