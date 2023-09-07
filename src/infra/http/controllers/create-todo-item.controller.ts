import { CreateTodoItemUseCase } from '@/domain/to-do/use-cases/create-todo-item';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

const createTodoItemBodySchema = z.object({
  name: z.string().min(3).max(20),
  description: z.string().max(50).optional(),
});

type CreateTodoBodySchema = z.infer<typeof createTodoItemBodySchema>;
const validationPipeZodBody = new ZodValidationPipe(createTodoItemBodySchema);

type CreateTodoItemParam = {
  id: string;
};

@Controller('/todos')
export class CreateTodoItemController {
  constructor(private createTodoItemUseCase: CreateTodoItemUseCase) {}

  @Post(':id/item')
  async handle(
    @Body(validationPipeZodBody) body: CreateTodoBodySchema,
    @Param() param: CreateTodoItemParam,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const { name, description } = body;
    const { sub: userId } = currentUser;
    const { id: todoId } = param;

    const result = await this.createTodoItemUseCase.execute({
      description,
      name,
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
