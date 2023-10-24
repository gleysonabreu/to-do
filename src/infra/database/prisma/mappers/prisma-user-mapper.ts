import { Prisma, User as PrismaUser } from '@prisma/client';
import { User } from '../../../../domain/user/entities/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        email: raw.email,
        firstName: raw.firstName,
        lastName: raw.lastName,
        password: raw.password,
        username: raw.username,
        isPublic: raw.isPublic,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      email: user.email,
      lastName: user.lastName,
      password: user.password,
      username: user.username,
      isPublic: user.isPublic,
    };
  }
}
