import { Todo } from '../entities/todo';

export abstract class TodoRepository {
  abstract findById(id: string): Promise<Todo | null>;
  abstract create(todo: Todo): Promise<void>;
}
