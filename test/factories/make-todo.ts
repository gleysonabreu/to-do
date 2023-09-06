import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id';
import { Todo, TodoProps } from '@/domain/to-do/entities/todo';

export function makeTodo(
  override: Partial<TodoProps> = {},
  id?: UniqueEntityID,
) {
  const user = Todo.create(
    {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return user;
}
