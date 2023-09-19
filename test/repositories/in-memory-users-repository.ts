import { User } from '../../src/domain/user/entities/user';
import { UsersRepository } from '../../src/domain/user/repositories/users-repository';

export class InMemoryUsersRepository extends UsersRepository {
  public users: User[] = [];

  async findById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id.toString() === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = this.users.find((user) => user.username === username);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(user: User): Promise<void> {
    this.users.push(user);
  }
}
