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
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { UserAlreadyExistsError } from '@/domain/user/use-cases/errors/user-already-exists-error';
import { UpdateProfileUseCase } from '@/domain/user/use-cases/update-profile';

const updateProfileBodySchema = z.object({
  username: z.string().min(4),
  is_public: z.boolean(),
});

type UpdateProfileBodySchema = z.infer<typeof updateProfileBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(updateProfileBodySchema);

@Controller('/users/profile')
export class UpdateProfileController {
  constructor(private updateProfile: UpdateProfileUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateProfileBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { is_public: isPublic, username } = body;
    const { sub: userId } = user;

    const result = await this.updateProfile.execute({
      isPublic,
      userId,
      username,
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
