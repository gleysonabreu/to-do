import { AuthenticateUserUseCase } from '@/domain/user/use-cases/authenticate-user';
import { Public } from '@/infra/auth/is-public';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { WrongCredentialsError } from '@/domain/user/use-cases/errors/wrong-credentials-error';

const authUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(15),
});

type AuthUserBodySchema = z.infer<typeof authUserBodySchema>;

@Controller('/auth')
export class AuthenticateUserController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @Public()
  @UsePipes(new ZodValidationPipe(authUserBodySchema))
  async handle(@Body() body: AuthUserBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateUser.execute({ email, password });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
