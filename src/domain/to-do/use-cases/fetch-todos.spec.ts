import { InMemoryTodoRepository } from '@test/repositories/in-memory-todos-repository';
import { makeTodo } from '@test/factories/make-todo';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchTodosUseCase } from './fetch-todos';

let sut: FetchTodosUseCase;
let inMemoryTodoRepository: InMemoryTodoRepository;

describe('Fetch To-dos', () => {
  beforeEach(() => {
    inMemoryTodoRepository = new InMemoryTodoRepository();
    sut = new FetchTodosUseCase(inMemoryTodoRepository);
  });

  it('should be able to fetch todos', async () => {
    const todo = makeTodo({ userId: new UniqueEntityID('1') });
    inMemoryTodoRepository.todos.push(todo);

    const result = await sut.execute({
      userId: '1',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      todos: expect.any(Array),
    });
    expect(result.value.todos.length).toEqual(1);
    expect(result.value.todos[0]).toEqual(todo);
  });
});
