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
import { GetTodoByIdController } from './controllers/get-todo-by-id.controller';
import { GetTodoById } from '@/domain/to-do/use-cases/get-todo-by-id';
import { FetchItemsByTodoIdController } from './controllers/fetch-items-by-todo-id.controller';
import { FetchItemsByTodoId } from '@/domain/to-do/use-cases/fetch-items-by-todo-id';
import { CheckTodoItemController } from './controllers/check-todo-item.controller';
import { DoneTodoItemUseCase } from '@/domain/to-do/use-cases/done-todo-item';
import { UnDoneTodoItemUseCase } from '@/domain/to-do/use-cases/undone-todo-item';
import { MeController } from './controllers/me.controller';
import { GetCurrentUserUseCase } from '@/domain/user/use-cases/get-current-user';
import { UpdateAccountController } from './controllers/update-account.controller';
import { UpdateAccountUseCase } from '@/domain/user/use-cases/update-account';
import { UpdateProfileUseCase } from '@/domain/user/use-cases/update-profile';
import { UpdateProfileController } from './controllers/update-profile.controller';
import { FindUserByUsernameUseCase } from '@/domain/user/use-cases/find-user-by-username';
import { FindUserByUsernameController } from './controllers/find-user-by-username.controller';
import { FetchUsersByUsernameOrNameController } from './controllers/fetch-users-by-username-or-name.controller';
import { FetchUsersByUsernameOrNameUseCase } from '@/domain/user/use-cases/fetch-users-by-username-or-name';

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
    GetTodoByIdController,
    FetchItemsByTodoIdController,
    CheckTodoItemController,
    MeController,
    UpdateAccountController,
    UpdateProfileController,
    FindUserByUsernameController,
    FetchUsersByUsernameOrNameController,
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
    UpdateAccountUseCase,
    UpdateProfileUseCase,
    FindUserByUsernameUseCase,
    FetchUsersByUsernameOrNameUseCase,
  ],
})
export class HttpModule {}
