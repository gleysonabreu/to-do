import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { UpdateAccountUseCase } from '@/domain/user/use-cases/update-account';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { UserAlreadyExistsError } from '@/domain/user/use-cases/errors/user-already-exists-error';

const updateUserBodySchema = z.object({
  firstName: z.string().min(2),
  email: z.string().email(),
  lastName: z.string().min(2),
});

type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(updateUserBodySchema);

@Controller('/users')
export class UpdateAccountController {
  constructor(private updateAccountUseCase: UpdateAccountUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateUserBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { email, firstName, lastName } = body;
    const { sub: id } = user;

    const result = await this.updateAccountUseCase.execute({
      email,
      firstName,
      lastName,
      id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
