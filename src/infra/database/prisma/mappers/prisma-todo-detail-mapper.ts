import { Prisma, Todo as PrismaTodo } from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Todo } from '@/domain/to-do/entities/todo';
import { TodoDetails } from '@/domain/to-do/entities/value-objects/todo-details';

export type PrismaTodoDetails = PrismaTodo & {
  amount: number;
  completed: number;
};

export class PrismaTodoDetailsMapper {
  static toDomain(raw: PrismaTodoDetails): TodoDetails {
    return TodoDetails.create({
      id: new UniqueEntityID(raw.id),
      title: raw.title,
      userId: new UniqueEntityID(raw.userId),
      description: raw.description,
      amount: raw.amount,
      completed: raw.completed,
    });
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
