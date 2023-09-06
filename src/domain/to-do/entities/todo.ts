import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface TodoProps {
  title: string;
  description?: string | null;
  userId: UniqueEntityID;
}

export class Todo extends Entity<TodoProps> {
  get userId() {
    return this.props.userId;
  }

  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
  }

  get description() {
    return this.props.description;
  }

  set description(description: string | null) {
    this.props.description = description;
  }

  static create(props: TodoProps, id?: UniqueEntityID) {
    const todo = new Todo(props, id);

    return todo;
  }
}
