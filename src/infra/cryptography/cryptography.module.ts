import { Module } from '@nestjs/common';
import { HashComparer } from 'src/domain/user/repositories/cryptography/hash-comparer';
import { BcryptHash } from './bcrypt-hash';
import { HashGenerator } from 'src/domain/user/repositories/cryptography/hash-generator';
import { Encrypt } from '@/domain/user/repositories/cryptography/encrypt';
import { JwtEncrypt } from './jwt-encrypt';

@Module({
  providers: [
    {
      provide: HashComparer,
      useClass: BcryptHash,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHash,
    },
    {
      provide: Encrypt,
      useClass: JwtEncrypt,
    },
  ],
  exports: [HashGenerator, HashComparer, Encrypt],
})
export class CryptographyModule {}
