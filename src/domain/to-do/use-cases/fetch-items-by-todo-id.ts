import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { TodoItem } from '../entities/todo-item';
import { TodoRepository } from '../repositories/todo-repository';
import { TodoItemRepository } from '../repositories/todo-item-repository';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface FetchItemsByTodoIdRequest {
  todoId: string;
}

type FetchItemsByTodoIdResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    todoItems: TodoItem[];
  }
>;

@Injectable()
export class FetchItemsByTodoId {
  constructor(
    private todoRepository: TodoRepository,
    private todoItemRepository: TodoItemRepository,
  ) {}

  async execute({
    todoId,
  }: FetchItemsByTodoIdRequest): Promise<FetchItemsByTodoIdResponse> {
    const todo = await this.todoRepository.findById(todoId);

    if (!todo) {
      return left(new ResourceNotFoundError());
    }

    const todoItems = await this.todoItemRepository.fetchItemsByTodoId(todoId);

    return right({
      todoItems,
    });
  }
}
