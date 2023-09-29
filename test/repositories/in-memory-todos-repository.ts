import { Todo } from '@/domain/to-do/entities/todo';
import { TodoDetails } from '@/domain/to-do/entities/value-objects/todo-details';
import { TodoRepository } from '@/domain/to-do/repositories/todo-repository';

export class InMemoryTodoRepository implements TodoRepository {
  public todos: Todo[] = [];

  async getTodosByUserId(userId: string): Promise<TodoDetails[]> {
    const todos = this.todos.filter(
      (item) => item.userId.toString() === userId,
    );

    return todos.map((todo) =>
      TodoDetails.create({
        id: todo.id,
        title: todo.title,
        userId: todo.userId,
        description: todo.description,
        amount: 0,
        completed: 0,
      }),
    );
  }

  async delete(todo: Todo): Promise<void> {
    const removeTodo = this.todos.filter(
      (item) => item.id.toString() !== todo.id.toString(),
    );

    this.todos = removeTodo;
  }

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
