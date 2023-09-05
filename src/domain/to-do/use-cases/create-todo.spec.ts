import { InMemoryTodoRepository } from '../../../../test/repositories/in-memory-todos-repository';
import { CreateTodoUseCase } from './create-todo';

let sut: CreateTodoUseCase;
let inMemoryTodoRepository: InMemoryTodoRepository;

describe('Create Todo', () => {
  beforeEach(() => {
    inMemoryTodoRepository = new InMemoryTodoRepository();
    sut = new CreateTodoUseCase(inMemoryTodoRepository);
  });

  it('should be able to create a new todo', async () => {
    const result = await sut.execute({
      title: 'Testing todo',
      userId: '1',
      description: 'Description todo',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryTodoRepository.todos[0]).toEqual(result.value.todo);
  });
});
