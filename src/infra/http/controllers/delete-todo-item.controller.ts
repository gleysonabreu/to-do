import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DeleteTodoItemUseCase } from '@/domain/to-do/use-cases/delete-todo-item';

type DeleteTodoItemParam = {
  id: string;
};

@Controller('/items')
export class DeleteTodoItemController {
  constructor(private deleteTodoItemUseCase: DeleteTodoItemUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  async handle(
    @Param() param: DeleteTodoItemParam,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const { sub: userId } = currentUser;
    const { id: todoItemId } = param;

    const result = await this.deleteTodoItemUseCase.execute({
      todoItemId,
      userId,
    });

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
  }
}
