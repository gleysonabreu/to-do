import { Module } from '@nestjs/common';
import { HashComparer } from 'src/domain/user/repositories/cryptography/hash-comparer';
import { BcryptHash } from './bcrypt-hash';
import { HashGenerator } from 'src/domain/user/repositories/cryptography/hash-generator';

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
  ],
  exports: [HashGenerator, HashComparer],
})
export class CryptographyModule {}
