import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface TodoItemProps {
  name: string;
  description?: string | null;
  check: boolean;
  todoId: UniqueEntityID;
}

export class TodoItem extends Entity<TodoItemProps> {
  get todoId() {
    return this.props.todoId;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get description() {
    return this.props.description;
  }

  set description(description: string | null) {
    this.props.description = description;
  }

  get check() {
    return this.props.check;
  }

  done() {
    this.props.check = true;
  }

  undone() {
    this.props.check = false;
  }

  static create(props: Optional<TodoItemProps, 'check'>, id?: UniqueEntityID) {
    const todoItem = new TodoItem(
      {
        ...props,
        check: props.check ?? false,
      },
      id,
    );

    return todoItem;
  }
}
