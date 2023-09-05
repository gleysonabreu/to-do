import { CreateTodoUseCase } from '@/domain/to-do/use-cases/create-todo';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';

const createTodoBodySchema = z.object({
  title: z.string().min(3).max(20),
  description: z.string().optional(),
});

type CreateTodoBodySchema = z.infer<typeof createTodoBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createTodoBodySchema);

@Controller('/todos')
export class CreateTodoController {
  constructor(private createTodoUseCase: CreateTodoUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateTodoBodySchema,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const { description, title } = body;
    const { sub: userId } = currentUser;

    const result = await this.createTodoUseCase.execute({
      title,
      userId,
      description,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
