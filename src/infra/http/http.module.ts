import { Module } from '@nestjs/common';
import { Database } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateAccount } from './controllers/create-account.controller';
import { RegisterUserUseCase } from '@/domain/user/use-cases/register-user';
import { AuthenticateUserController } from './controllers/authenticate-user.controller';
import { AuthenticateUserUseCase } from '@/domain/user/use-cases/authenticate-user';
import { CreateTodoController } from './controllers/create-todo.controller';
import { CreateTodoUseCase } from '@/domain/to-do/use-cases/create-todo';
import { CreateTodoItemController } from './controllers/create-todo-item.controller';
import { CreateTodoItemUseCase } from '@/domain/to-do/use-cases/create-todo-item';
import { DeleteTodoItemController } from './controllers/delete-todo-item.controller';
import { DeleteTodoItemUseCase } from '@/domain/to-do/use-cases/delete-todo-item';
import { DeleteTodoController } from './controllers/delete-todo.controller';
import { DeleteTodoUseCase } from '@/domain/to-do/use-cases/delete-todo';
import { FetchTodosController } from './controllers/fetch-todos.controller';
import { FetchTodosUseCase } from '@/domain/to-do/use-cases/fetch-todos';
import { GetTodoByidController } from './controllers/get-todo-by-id.controller';
import { GetTodoById } from '@/domain/to-do/use-cases/get-todo-by-id';
import { FetchItemsByTodoIdController } from './controllers/fetch-items-by-todo-id.controller';
import { FetchItemsByTodoId } from '@/domain/to-do/use-cases/fetch-items-by-todo-id';
import { CheckTodoItemController } from './controllers/check-todo-item.controller';
import { DoneTodoItemUseCase } from '@/domain/to-do/use-cases/done-todo-item';
import { UnDoneTodoItemUseCase } from '@/domain/to-do/use-cases/undone-todo-item';
import { MeController } from './controllers/me.controller';
import { GetCurrentUserUseCase } from '@/domain/user/use-cases/get-current-user';

@Module({
  imports: [Database, CryptographyModule],
  controllers: [
    CreateAccount,
    AuthenticateUserController,
    CreateTodoController,
    CreateTodoItemController,
    DeleteTodoItemController,
    DeleteTodoController,
    FetchTodosController,
    GetTodoByidController,
    FetchItemsByTodoIdController,
    CheckTodoItemController,
    MeController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    CreateTodoUseCase,
    CreateTodoItemUseCase,
    DeleteTodoItemUseCase,
    DeleteTodoUseCase,
    FetchTodosUseCase,
    GetTodoById,
    FetchItemsByTodoId,
    DoneTodoItemUseCase,
    UnDoneTodoItemUseCase,
    GetCurrentUserUseCase,
  ],
})
export class HttpModule {}
