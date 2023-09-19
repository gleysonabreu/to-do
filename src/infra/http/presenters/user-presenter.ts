import { User } from '@/domain/user/entities/user';

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      username: user.username,
    };
  }
}
