import { TodoItem } from '../entities/todo-item';

export abstract class TodoItemRepository {
  abstract create(todoItem: TodoItem): Promise<void>;
}
