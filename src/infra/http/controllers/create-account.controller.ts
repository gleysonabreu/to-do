import { RegisterUserUseCase } from '@/domain/user/use-cases/register-user';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { UserAlreadyExistsError } from '@/domain/user/use-cases/errors/user-already-exists-error';
import { Public } from '@/infra/auth/is-public';

const createAccountBodySchema = z.object({
  firstName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(5).max(15),
  lastName: z.string().min(2),
  username: z.string().min(4),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/users')
export class CreateAccount {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  @Public()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { email, firstName, lastName, password, username } = body;

    const result = await this.registerUser.execute({
      email,
      firstName,
      lastName,
      password,
      username,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
