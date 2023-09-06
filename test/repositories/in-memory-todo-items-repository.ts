import { TodoItem } from '@/domain/to-do/entities/todo-item';
import { TodoItemRepository } from '@/domain/to-do/repositories/todo-item-repository';

export class InMemoryTodoItemRepository implements TodoItemRepository {
  public todoItems: TodoItem[] = [];

  async create(todoItem: TodoItem): Promise<void> {
    this.todoItems.push(todoItem);
  }
}
