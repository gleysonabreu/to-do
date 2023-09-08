import { FetchTodosUseCase } from '@/domain/to-do/use-cases/fetch-todos';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import { BadRequestException, Controller, Get } from '@nestjs/common';
import { TodoPresenter } from '../presenters/todo-presenter';

@Controller('/todos')
export class FetchTodosController {
  constructor(private fetchTodosUseCase: FetchTodosUseCase) {}

  @Get()
  async handle(@CurrentUser() currentUser: UserPayload) {
    const { sub: userId } = currentUser;

    const result = await this.fetchTodosUseCase.execute({ userId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const todos = result.value.todos;

    return { todos: todos.map(TodoPresenter.toHTTP) };
  }
}
