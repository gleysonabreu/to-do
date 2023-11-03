import { FetchTodosUseCase } from '@/domain/to-do/use-cases/fetch-todos';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { TodoDetailsPresenter } from '../presenters/todo-details-presenter';
import { Public } from '@/infra/auth/is-public';

type FetchTodosControllerParams = {
  id: string;
};

@Controller('/users')
export class FetchTodosController {
  constructor(private fetchTodosUseCase: FetchTodosUseCase) {}

  @Public()
  @Get(':id/todos')
  async handle(@Param() params: FetchTodosControllerParams) {
    const { id: userId } = params;

    const result = await this.fetchTodosUseCase.execute({ userId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const todos = result.value.todos;

    return { todos: todos.map(TodoDetailsPresenter.toHTTP) };
  }
}
