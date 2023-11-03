import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { InMemoryTodoRepository } from '@test/repositories/in-memory-todos-repository';
import { makeTodo } from '@test/factories/make-todo';
import { InMemoryTodoItemRepository } from '@test/repositories/in-memory-todo-items-repository';
import { makeTodoItem } from '@test/factories/make-todo-item';
import { FetchItemsByTodoId } from './fetch-items-by-todo-id';

let sut: FetchItemsByTodoId;
let inMemoryTodoRepository: InMemoryTodoRepository;
let inMemoryTodoItemRepository: InMemoryTodoItemRepository;

describe('Fetch items by todo id', () => {
  beforeEach(() => {
    inMemoryTodoRepository = new InMemoryTodoRepository();
    inMemoryTodoItemRepository = new InMemoryTodoItemRepository();
    sut = new FetchItemsByTodoId(
      inMemoryTodoRepository,
      inMemoryTodoItemRepository,
    );
  });

  it('should not be able fetch items if todo not exists', async () => {
    const result = await sut.execute({
      todoId: 'any-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should be able to fetch items by todo id', async () => {
    const todo = makeTodo();
    inMemoryTodoRepository.todos.push(todo);

    const item = makeTodoItem({ todoId: todo.id });
    inMemoryTodoItemRepository.todoItems.push(item);

    const result = await sut.execute({
      todoId: todo.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      todoItems: expect.any(Array),
    });
    expect(result.value).toEqual({
      todoItems: [item],
    });
  });
});
