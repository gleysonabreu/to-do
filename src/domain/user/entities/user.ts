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
  set firstName(firstName: string) {
    this.props.firstName = firstName;
  }

  get firstName() {
    return this.props.firstName;
  }

  set lastName(lastName: string) {
    this.props.lastName = lastName;
  }

  get lastName() {
    return this.props.lastName;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get email() {
    return this.props.email;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get password() {
    return this.props.password;
  }

  set username(username: string) {
    this.props.username = username;
  }

  get username() {
    return this.props.username;
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id);
    return user;
  }
}
