import { InMemoryTodoRepository } from '@test/repositories/in-memory-todos-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeTodo } from '@test/factories/make-todo';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DeleteTodoUseCase } from './delete-todo';

let sut: DeleteTodoUseCase;
let inMemoryTodoRepository: InMemoryTodoRepository;

describe('Delete To-do', () => {
  beforeEach(() => {
    inMemoryTodoRepository = new InMemoryTodoRepository();
    sut = new DeleteTodoUseCase(inMemoryTodoRepository);
  });

  it('should be able to delete a to-do', async () => {
    const todo = makeTodo(
      {
        userId: new UniqueEntityID('any-id-user'),
      },
      new UniqueEntityID('any-id-todo'),
    );
    inMemoryTodoRepository.todos.push(todo);

    const result = await sut.execute({
      userId: 'any-id-user',
      todoId: 'any-id-todo',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryTodoRepository.todos.length).toEqual(0);
  });

  it('should not be able to delete a to-do if to-do not exists', async () => {
    const result = await sut.execute({
      todoId: 'any-id',
      userId: 'any-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should not be able to delete a to-do if to-do is not yours', async () => {
    const todo = makeTodo();
    inMemoryTodoRepository.todos.push(todo);

    const result = await sut.execute({
      todoId: todo.id.toString(),
      userId: 'any-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toEqual(new NotAllowedError());
    expect(inMemoryTodoRepository.todos.length).toEqual(1);
  });
});
