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

@Module({
  imports: [Database, CryptographyModule],
  controllers: [
    CreateAccount,
    AuthenticateUserController,
    CreateTodoController,
    CreateTodoItemController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    CreateTodoUseCase,
    CreateTodoItemUseCase,
  ],
})
export class HttpModule {}
