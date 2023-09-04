import { hash, compare } from 'bcryptjs';
import { HashComparer } from '../../domain/user/repositories/cryptography/hash-comparer';
import { HashGenerator } from '../../domain/user/repositories/cryptography/hash-generator';

export class BcryptHash implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
