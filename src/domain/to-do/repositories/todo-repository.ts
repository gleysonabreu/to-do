import { Todo } from '../entities/todo';
import { TodoDetails } from '../entities/value-objects/todo-details';

export abstract class TodoRepository {
  abstract findById(id: string): Promise<Todo | null>;
  abstract create(todo: Todo): Promise<void>;
  abstract delete(todo: Todo): Promise<void>;
  abstract getTodosByUserId(userId: string): Promise<TodoDetails[]>;
}
