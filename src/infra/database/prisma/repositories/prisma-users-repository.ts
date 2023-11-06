import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../domain/user/repositories/users-repository';
import { User } from 'src/domain/user/entities/user';
import { PrismaService } from '../prisma.service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { UserRole } from '@prisma/client';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findManyUsersByUsernameOrName(usernameOrName: string): Promise<User[]> {
    const query = `%${usernameOrName}%`;
    const users = await this.prisma.$queryRaw<
      {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        username: string;
        isPublic: boolean;
        role: UserRole;
      }[]
    >`
    SELECT * FROM
      users 
    WHERE 
      first_name LIKE ${query} OR
      last_name LIKE ${query} OR
      username LIKE ${query}`;

    return users
      .map((user) => {
        return {
          ...user,
          firstName: user.first_name,
          lastName: user.last_name,
        };
      })
      .map(PrismaUserMapper.toDomain);
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({ data });
  }
}
