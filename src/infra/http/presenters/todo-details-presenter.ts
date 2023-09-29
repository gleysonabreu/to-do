import { TodoDetails } from '@/domain/to-do/entities/value-objects/todo-details';

export class TodoDetailsPresenter {
  static toHTTP(todo: TodoDetails) {
    return {
      id: todo.id.toString(),
      title: todo.title,
      description: todo.description,
      amount: todo.amount,
      completed: todo.completed,
    };
  }
}
