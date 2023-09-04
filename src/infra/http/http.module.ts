import { Module } from '@nestjs/common';
import { Database } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [Database, CryptographyModule],
})
export class HttpModule {}
