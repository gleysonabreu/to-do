import { TodoItem } from '../entities/todo-item';

export abstract class TodoItemRepository {
  abstract create(todoItem: TodoItem): Promise<void>;
  abstract findById(id: string): Promise<TodoItem | null>;
  abstract delete(id: string): Promise<void>;
}
