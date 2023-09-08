import { Todo } from '@/domain/to-do/entities/todo';

export class TodoPresenter {
  static toHTTP(todo: Todo) {
    return {
      id: todo.id.toString(),
      title: todo.title,
      description: todo.description,
    };
  }
}
