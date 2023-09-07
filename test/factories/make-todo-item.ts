import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id';
import { TodoItem, TodoItemProps } from '@/domain/to-do/entities/todo-item';

export function makeTodoItem(
  override: Partial<TodoItemProps> = {},
  id?: UniqueEntityID,
) {
  const todoItem = TodoItem.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      todoId: new UniqueEntityID(),
      check: false,
      ...override,
    },
    id,
  );

  return todoItem;
}
