import { Todo } from '@/domain/to-do/entities/todo';
import { TodoRepository } from '@/domain/to-do/repositories/todo-repository';

export class InMemoryTodoRepository implements TodoRepository {
  public todos: Todo[] = [];

  async findById(id: string): Promise<Todo | null> {
    const todo = this.todos.find((todo) => todo.id.toString() === id);

    if (!todo) {
      return null;
    }

    return todo;
  }

  async create(todo: Todo): Promise<void> {
    this.todos.push(todo);
  }
}
