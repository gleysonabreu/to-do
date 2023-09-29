import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface TodoDetailsProps {
  id: UniqueEntityID;
  title: string;
  description?: string | null;
  userId: UniqueEntityID;
  amount: number;
  completed: number;
}

export class TodoDetails extends ValueObject<TodoDetailsProps> {
  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get userId() {
    return this.props.userId;
  }

  get amount() {
    return this.props.amount;
  }

  get completed() {
    return this.props.completed;
  }

  static create(props: TodoDetailsProps) {
    return new TodoDetails(props);
  }
}
