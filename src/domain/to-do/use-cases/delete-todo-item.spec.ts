import { InMemoryTodoItemRepository } from '@test/repositories/in-memory-todo-items-repository';
import { InMemoryTodoRepository } from '@test/repositories/in-memory-todos-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTodo } from '@test/factories/make-todo';
import { makeTodoItem } from '@test/factories/make-todo-item';
import { DeleteTodoItemUseCase } from './delete-todo-item';

let sut: DeleteTodoItemUseCase;
let inMemoryTodoRepository: InMemoryTodoRepository;
let inMemoryTodoItemRepository: InMemoryTodoItemRepository;

describe('Delete todo item', () => {
  beforeEach(() => {
    inMemoryTodoRepository = new InMemoryTodoRepository();
    inMemoryTodoItemRepository = new InMemoryTodoItemRepository();
    sut = new DeleteTodoItemUseCase(
      inMemoryTodoItemRepository,
      inMemoryTodoRepository,
    );
  });

  it('should be able to delete a todo item', async () => {
    const todo = makeTodo();
    const todoItem = makeTodoItem({ todoId: todo.id });
    inMemoryTodoRepository.todos.push(todo);
    inMemoryTodoItemRepository.todoItems.push(todoItem);

    const result = await sut.execute({
      todoItemId: todoItem.id.toString(),
      userId: todo.userId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryTodoItemRepository.todoItems.length).toEqual(0);
  });

  it('should not be able to remove an todo item if todo item not exists', async () => {
    const result = await sut.execute({
      todoItemId: 'any-id',
      userId: '1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should not be able to remove an todo item if todo is not yours', async () => {
    const todo = makeTodo();
    const todoItem = makeTodoItem({ todoId: todo.id });
    inMemoryTodoRepository.todos.push(todo);
    inMemoryTodoItemRepository.todoItems.push(todoItem);

    const result = await sut.execute({
      todoItemId: todoItem.id.toString(),
      userId: 'any-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toEqual(new NotAllowedError());
  });

  it('should not be able to remove an todo item if todo not exists', async () => {
    const todoItem = makeTodoItem();
    inMemoryTodoItemRepository.todoItems.push(todoItem);

    const result = await sut.execute({
      todoItemId: todoItem.id.toString(),
      userId: 'any-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });
});
