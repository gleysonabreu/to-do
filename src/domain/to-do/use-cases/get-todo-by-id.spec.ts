import { makeTodo } from '@test/factories/make-todo';
import { InMemoryTodoRepository } from '@test/repositories/in-memory-todos-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { GetTodoById } from './get-todo-by-id';

let sut: GetTodoById;
let inMemoryTodoRepository: InMemoryTodoRepository;

describe('Get Todo By Id', () => {
  beforeEach(() => {
    inMemoryTodoRepository = new InMemoryTodoRepository();
    sut = new GetTodoById(inMemoryTodoRepository);
  });

  it('should be able to get todo by id', async () => {
    const todo = makeTodo();
    inMemoryTodoRepository.todos.push(todo);

    const result = await sut.execute({
      todoId: todo.id.toString(),
      userId: todo.userId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      todo: todo,
    });
  });

  it('should not be able to get todo if todo not exists', async () => {
    const result = await sut.execute({
      todoId: 'any-id',
      userId: 'any-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should not be able to get todo if todo is not yours', async () => {
    const todo = makeTodo();
    inMemoryTodoRepository.todos.push(todo);

    const result = await sut.execute({
      todoId: todo.id.toString(),
      userId: 'any-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toEqual(new NotAllowedError());
  });
});
