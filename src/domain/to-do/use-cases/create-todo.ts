import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../repositories/todo-repository';
import { Either, right } from '@/core/either';
import { Todo } from '../entities/todo';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface CreateTodoUseCaseRequest {
  title: string;
  description?: string | null;
  userId: string;
}

type CreateTodoUseCaseResponse = Either<
  null,
  {
    todo: Todo;
  }
>;

@Injectable()
export class CreateTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute({
    title,
    userId,
    description,
  }: CreateTodoUseCaseRequest): Promise<CreateTodoUseCaseResponse> {
    const todo = Todo.create({
      title,
      userId: new UniqueEntityID(userId),
      description,
    });

    await this.todoRepository.create(todo);

    return right({
      todo,
    });
  }
}
