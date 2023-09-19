import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { GetCurrentUserUseCase } from '@/domain/user/use-cases/get-current-user';
import { UserPresenter } from '../presenters/user-presenter';

@Controller('/me')
export class MeController {
  constructor(private getCurrentUser: GetCurrentUserUseCase) {}

  @Get()
  async handle(@CurrentUser() currentUser: UserPayload) {
    const { sub: id } = currentUser;

    const result = await this.getCurrentUser.execute({ id });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const user = result.value.user;
    return { user: UserPresenter.toHTTP(user) };
  }
}
