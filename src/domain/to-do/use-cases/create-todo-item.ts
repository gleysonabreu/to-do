import { Either, left, right } from '@/core/either';
import { TodoItemRepository } from '../repositories/todo-item-repository';
import { TodoNotExistsError } from './errors/todo-not-exists-error';
import { TodoItem } from '../entities/todo-item';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { TodoRepository } from '../repositories/todo-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface CreateTodoItemUseCaseRequest {
  name: string;
  description?: string | null;
  todoId: string;
  userId: string;
}

type CreateTodoItemUseCaseResponse = Either<
  TodoNotExistsError,
  {
    todoItem: TodoItem;
  }
>;

@Injectable()
export class CreateTodoItemUseCase {
  constructor(
    private todoItemRepository: TodoItemRepository,
    private todoRepository: TodoRepository,
  ) {}

  async execute({
    name,
    todoId,
    userId,
    description,
  }: CreateTodoItemUseCaseRequest): Promise<CreateTodoItemUseCaseResponse> {
    const todo = await this.todoRepository.findById(todoId);

    if (!todo) {
      return left(new TodoNotExistsError(todoId));
    }

    if (todo.userId.toString() !== userId) {
      return left(new NotAllowedError());
    }

    const todoItem = TodoItem.create({
      todoId: new UniqueEntityID(todoId),
      name,
      description,
    });

    await this.todoItemRepository.create(todoItem);

    return right({
      todoItem,
    });
  }
}
