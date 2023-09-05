import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from 'src/domain/user/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { TodoRepository } from '@/domain/to-do/repositories/todo-repository';
import { PrismaTodoRepository } from './prisma/repositories/prisma-todos-repository';

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
  ],
  exports: [PrismaService, UsersRepository, TodoRepository],
})
export class Database {}
