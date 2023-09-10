import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { DoneTodoItemUseCase } from '@/domain/to-do/use-cases/done-todo-item';
import { UnDoneTodoItemUseCase } from '@/domain/to-do/use-cases/undone-todo-item';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';

type CheckTodoItemControllerParams = {
  id: string;
};

@Controller('/items')
export class CheckTodoItemController {
  constructor(
    private doneTodoItemUseCase: DoneTodoItemUseCase,
    private unDoneTodoItemUseCase: UnDoneTodoItemUseCase,
  ) {}

  @Patch(':id/done')
  @HttpCode(204)
  async done(
    @Param() params: CheckTodoItemControllerParams,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const { id: todoItemId } = params;
    const { sub: userId } = currentUser;

    const result = await this.doneTodoItemUseCase.execute({
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
          throw new BadRequestException();
      }
    }
  }

  @Patch(':id/undone')
  @HttpCode(204)
  async undone(
    @Param() params: CheckTodoItemControllerParams,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const { id: todoItemId } = params;
    const { sub: userId } = currentUser;

    const result = await this.unDoneTodoItemUseCase.execute({
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
          throw new BadRequestException();
      }
    }
  }
}
