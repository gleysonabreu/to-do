import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { GetTodoById } from '@/domain/to-do/use-cases/get-todo-by-id';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { TodoPresenter } from '../presenters/todo-presenter';

interface GetTodoByIdParams {
  id: string;
}

@Controller('/todos')
export class GetTodoByidController {
  constructor(private getTodoById: GetTodoById) {}

  @Get(':id')
  async handle(@Param() params: GetTodoByIdParams, @CurrentUser() currentUser: UserPayload) {
    const { id: todoId } = params;
    const { sub: userId } = currentUser;

    const result = await this.getTodoById.execute({ todoId, userId });

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

    const todo = result.value.todo;
    return { todo: TodoPresenter.toHTTP(todo) };
  }
}
