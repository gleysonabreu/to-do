import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Public } from '@/infra/auth/is-public';
import { FetchUsersByUsernameOrNameUseCase } from '@/domain/user/use-cases/fetch-users-by-username-or-name';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { UserPresenter } from '../presenters/user-presenter';

const usernameOrNameQueryParamSchema = z.string();

const usernameOrNameValidationPipe = new ZodValidationPipe(
  usernameOrNameQueryParamSchema,
);

type UsernameOrNameQueryParamSchema = z.infer<
  typeof usernameOrNameQueryParamSchema
>;

@Controller('/users')
export class FetchUsersByUsernameOrNameController {
  constructor(
    private fetchUsersByUsernameOrName: FetchUsersByUsernameOrNameUseCase,
  ) {}

  @Public()
  @Get()
  async handle(
    @Query('q', usernameOrNameValidationPipe)
    usernameOrName: UsernameOrNameQueryParamSchema,
  ) {
    const result = await this.fetchUsersByUsernameOrName.execute({
      usernameOrName,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const users = result.value.users;

    return { users: users.map(UserPresenter.toHTTP) };
  }
}
