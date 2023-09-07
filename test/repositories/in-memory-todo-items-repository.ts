import { TodoItem } from '@/domain/to-do/entities/todo-item';
import { TodoItemRepository } from '@/domain/to-do/repositories/todo-item-repository';

export class InMemoryTodoItemRepository implements TodoItemRepository {
  public todoItems: TodoItem[] = [];

  async delete(id: string): Promise<void> {
    const items = this.todoItems.filter((item) => item.id.toString() !== id);
    this.todoItems = items;
  }

  async findById(id: string): Promise<TodoItem | null> {
    const todoItem = this.todoItems.find((item) => item.id.toString() === id);

    if (!todoItem) {
      return null;
    }

    return todoItem;
  }

  async create(todoItem: TodoItem): Promise<void> {
    this.todoItems.push(todoItem);
  }
}
