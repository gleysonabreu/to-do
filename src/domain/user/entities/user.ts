import { Entity } from '../../../core/entities/entity';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';

export interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
}

export class User extends Entity<UserProps> {
  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get username() {
    return this.props.username;
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id);
    return user;
  }
}
