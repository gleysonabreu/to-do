import { Encrypt } from '@/domain/user/repositories/cryptography/encrypt';

export class FakeEncrypt implements Encrypt {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
