import { Module } from '@nestjs/common';
import { Database } from '../database/database.module';

@Module({
  imports: [Database],
})
export class HttpModule {}
