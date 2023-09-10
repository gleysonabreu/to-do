import { InMemoryTodoItemRepository } from '@test/repositories/in-memory-todo-items-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { InMemoryTodoRepository } from '@test/repositories/in-memory-todos-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTodo } from '@test/factories/make-todo';
import { makeTodoItem } from '@test/factories/make-todo-item';
import { DoneTodoItemUseCase } from './done-todo-item';

let sut: DoneTodoItemUseCase;
let inMemoryTodoItemRepository: InMemoryTodoItemRepository;
let inMemoryTodoRepository: InMemoryTodoRepository;

describe('Done todo item', () => {
  beforeEach(() => {
    inMemoryTodoItemRepository = new InMemoryTodoItemRepository();
    inMemoryTodoRepository = new InMemoryTodoRepository();
    sut = new DoneTodoItemUseCase(
      inMemoryTodoItemRepository,
      inMemoryTodoRepository,
    );
  });

  it('should be able to done todo item', async () => {
    const todo = makeTodo();
    const todoItem = makeTodoItem({ todoId: todo.id });
    inMemoryTodoItemRepository.todoItems.push(todoItem);
    inMemoryTodoRepository.todos.push(todo);

    const result = await sut.execute({
      todoItemId: todoItem.id.toString(),
      userId: todo.userId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryTodoItemRepository.todoItems[0].check).toEqual(true);
  });

  it('should not be able to done todo item if todo item not exists', async () => {
    const result = await sut.execute({
      todoItemId: 'any-id',
      userId: 'any-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should not be able to done todo item if todo not exists', async () => {
    const todoItem = makeTodoItem();
    const result = await sut.execute({
      todoItemId: todoItem.id.toString(),
      userId: 'any-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should not be able to done todo item if todo is not yours', async () => {
    const todo = makeTodo();
    const todoItem = makeTodoItem({ todoId: todo.id });
    inMemoryTodoItemRepository.todoItems.push(todoItem);
    inMemoryTodoRepository.todos.push(todo);

    const result = await sut.execute({
      todoItemId: todoItem.id.toString(),
      userId: 'any-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toEqual(new NotAllowedError());
  });
});
