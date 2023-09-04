import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from 'src/domain/user/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    PrismaUsersRepository,
  ],
  exports: [PrismaService, UsersRepository, PrismaUsersRepository],
})
export class Database {}
