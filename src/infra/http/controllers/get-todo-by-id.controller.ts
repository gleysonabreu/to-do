import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { GetTodoById } from '@/domain/to-do/use-cases/get-todo-by-id';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { TodoPresenter } from '../presenters/todo-presenter';
import { Public } from '@/infra/auth/is-public';

interface GetTodoByIdParams {
  id: string;
}

@Controller('/todos')
export class GetTodoByIdController {
  constructor(private getTodoById: GetTodoById) {}

  @Public()
  @Get(':id')
  async handle(@Param() params: GetTodoByIdParams) {
    const { id: todoId } = params;

    const result = await this.getTodoById.execute({ todoId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const todo = result.value.todo;
    return { todo: TodoPresenter.toHTTP(todo) };
  }
}
