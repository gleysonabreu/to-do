import { HashComparer } from '../../../src/domain/user/repositories/cryptography/hash-comparer';
import { HashGenerator } from '../../../src/domain/user/repositories/cryptography/hash-generator';

export class FakeHash implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash;
  }
}
