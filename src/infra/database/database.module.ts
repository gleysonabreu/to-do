import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from 'src/domain/user/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { TodoRepository } from '@/domain/to-do/repositories/todo-repository';
import { PrismaTodoRepository } from './prisma/repositories/prisma-todos-repository';
import { TodoItemRepository } from '@/domain/to-do/repositories/todo-item-repository';
import { PrismaTodoItemsRepository } from './prisma/repositories/prisma-todo-items-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: TodoRepository,
      useClass: PrismaTodoRepository,
    },
    {
      provide: TodoItemRepository,
      useClass: PrismaTodoItemsRepository,
    },
  ],
  exports: [PrismaService, UsersRepository, TodoRepository, TodoItemRepository],
})
export class Database {}
