import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { FetchItemsByTodoId } from '@/domain/to-do/use-cases/fetch-items-by-todo-id';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { TodoItemPresenter } from '../presenters/todo-item-presenter';
import { Public } from '@/infra/auth/is-public';

interface FetchItemsByTodoIdParams {
  id: string;
}

@Controller('/todos')
export class FetchItemsByTodoIdController {
  constructor(private fetchItemsByTodoId: FetchItemsByTodoId) {}

  @Public()
  @Get(':id/items')
  async handle(@Param() params: FetchItemsByTodoIdParams) {
    const { id: todoId } = params;

    const result = await this.fetchItemsByTodoId.execute({ todoId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const todoItems = result.value.todoItems;

    return { todo_items: todoItems.map(TodoItemPresenter.toHTTP) };
  }
}
