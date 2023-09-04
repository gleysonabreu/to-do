import { Module } from '@nestjs/common';
import { Database } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateAccount } from './controllers/create-account.controller';
import { RegisterUserUseCase } from '@/domain/user/use-cases/register-user';

@Module({
  imports: [Database, CryptographyModule],
  controllers: [CreateAccount],
  providers: [RegisterUserUseCase],
})
export class HttpModule {}
