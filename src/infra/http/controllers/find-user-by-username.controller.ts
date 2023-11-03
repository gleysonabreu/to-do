import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { Public } from '@/infra/auth/is-public';
import { FindUserByUsernameUseCase } from '@/domain/user/use-cases/find-user-by-username';
import { UserPresenter } from '../presenters/user-presenter';

interface FindUserByUsernameParams {
  username: string;
}

@Controller('/users')
export class FindUserByUsernameController {
  constructor(private findUserByUsername: FindUserByUsernameUseCase) {}

  @Public()
  @Get(':username')
  async handle(@Param() params: FindUserByUsernameParams) {
    const { username } = params;

    const result = await this.findUserByUsername.execute({ username });

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
