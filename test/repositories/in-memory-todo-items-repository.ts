import { TodoItem } from '@/domain/to-do/entities/todo-item';
import { TodoItemRepository } from '@/domain/to-do/repositories/todo-item-repository';

export class InMemoryTodoItemRepository implements TodoItemRepository {
  public todoItems: TodoItem[] = [];

  async save(todoItem: TodoItem): Promise<void> {
    const findIndex = this.todoItems.findIndex(
      (item) => item.id.toString() === todoItem.id.toString(),
    );

    this.todoItems[findIndex] = todoItem;
  }

  async fetchItemsByTodoId(todoId: string): Promise<TodoItem[]> {
    const items = this.todoItems.filter(
      (item) => item.todoId.toString() === todoId,
    );
    return items;
  }

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
