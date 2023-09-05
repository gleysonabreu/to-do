import { Prisma, Todo as PrismaTodo } from '@prisma/client';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Todo } from '@/domain/to-do/entities/todo';

export class PrismaTodoMapper {
  static toDomain(raw: PrismaTodo): Todo {
    return Todo.create(
      {
        title: raw.title,
        userId: new UniqueEntityID(raw.userId),
        description: raw.description,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(todo: Todo): Prisma.TodoUncheckedCreateInput {
    return {
      id: todo.id.toString(),
      title: todo.title,
      userId: todo.userId.toString(),
      description: todo.description,
    };
  }
}
