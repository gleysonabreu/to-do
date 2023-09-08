import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { DeleteTodoUseCase } from '@/domain/to-do/use-cases/delete-todo';
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

type DeleteTodoParams = {
  id: string;
};

@Controller('/todos')
export class DeleteTodoController {
  constructor(private deleteTodoUseCase: DeleteTodoUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  async handle(
    @Param() params: DeleteTodoParams,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const { id: todoId } = params;
    const { sub: userId } = currentUser;

    const result = await this.deleteTodoUseCase.execute({
      todoId,
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
