import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { Todo } from '@/domain/to-do/entities/todo';
import { Either, left, right } from '@/core/either';
import { TodoRepository } from '../repositories/todo-repository';

interface GetTodoByIdRequest {
  todoId: string;
}

type GetTodoByIdResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    todo: Todo;
  }
>;

@Injectable()
export class GetTodoById {
  constructor(private todoRepository: TodoRepository) {}

  async execute({ todoId }: GetTodoByIdRequest): Promise<GetTodoByIdResponse> {
    const todo = await this.todoRepository.findById(todoId);

    if (!todo) {
      return left(new ResourceNotFoundError());
    }

    return right({
      todo,
    });
  }
}
