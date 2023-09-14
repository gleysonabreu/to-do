import { Prisma, TodoItem as PrismaTodoItem } from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { TodoItem } from '@/domain/to-do/entities/todo-item';

export class PrismaTodoItemMapper {
  static toDomain(raw: PrismaTodoItem): TodoItem {
    return TodoItem.create(
      {
        name: raw.name,
        todoId: new UniqueEntityID(raw.todoId),
        check: raw.check,
        description: raw.description,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(todoItem: TodoItem): Prisma.TodoItemUncheckedCreateInput {
    return {
      id: todoItem.id.toString(),
      name: todoItem.name,
      description: todoItem.description,
      check: todoItem.check,
      todoId: todoItem.todoId.toString(),
    };
  }
}
