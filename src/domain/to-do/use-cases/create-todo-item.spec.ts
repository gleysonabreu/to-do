import { InMemoryTodoRepository } from '../../../../test/repositories/in-memory-todos-repository';
import { InMemoryTodoItemRepository } from '../../../../test/repositories/in-memory-todo-items-repository';
import { CreateTodoItemUseCase } from './create-todo-item';
import { makeTodo } from '../../../../test/factories/make-todo';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

let sut: CreateTodoItemUseCase;
let inMemoryCreateTodoItemRepository: InMemoryTodoItemRepository;
let inMemoryTodoRepository: InMemoryTodoRepository;

describe('Create To-do Item', () => {
  beforeEach(() => {
    inMemoryCreateTodoItemRepository = new InMemoryTodoItemRepository();
    inMemoryTodoRepository = new InMemoryTodoRepository();
    sut = new CreateTodoItemUseCase(inMemoryCreateTodoItemRepository, inMemoryTodoRepository);
  });

  it('should be able to create a new todo item', async () => {
    const todo = makeTodo({ userId: new UniqueEntityID('1') });
    inMemoryTodoRepository.todos.push(todo);

    const result = await sut.execute({
      userId: '1',
      description: 'Item description',
      name: 'Item todo',
      todoId: todo.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      todoItem: inMemoryCreateTodoItemRepository.todoItems[0],
    });
  });

  it('should not be able to create a new todo item if todo not exists', async () => {
    const todoId = '1';
    const result = await sut.execute({
      userId: '1',
      description: 'Item description',
      name: 'Item todo',
      todoId,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should not be able to create a new todo item if todo is not yours', async () => {
    const todo = makeTodo();
    inMemoryTodoRepository.todos.push(todo);

    const result = await sut.execute({
      userId: '1',
      description: 'Item description',
      name: 'Item todo',
      todoId: todo.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
