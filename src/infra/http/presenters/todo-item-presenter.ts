import { TodoItem } from '@/domain/to-do/entities/todo-item';

export class TodoItemPresenter {
  static toHTTP(todoItem: TodoItem) {
    return {
      id: todoItem.id.toString(),
      name: todoItem.name,
      description: todoItem.description,
      check: todoItem.check,
    };
  }
}
