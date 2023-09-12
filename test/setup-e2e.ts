import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import NodeEnvironment from 'jest-environment-node';
import type { JestEnvironmentConfig } from '@jest/environment';
import type { EnvironmentContext } from '@jest/environment';

export default class PrismaTestEnvironmentSetup extends NodeEnvironment {
  private schemaId: string;
  private prisma: PrismaClient;
  private databaseURL: string;

  constructor(config: JestEnvironmentConfig, _context: EnvironmentContext) {
    super(config, _context);

    this.schemaId = randomUUID();
    this.databaseURL = this.generateUniqueDatabaseURL(this.schemaId);
    this.prisma = new PrismaClient();
  }

  async setup() {
    process.env.DATABASE_URL = this.databaseURL;
    this.global.process.env.DATABASE_URL = this.databaseURL;

    execSync('pnpm prisma migrate deploy');

    return super.setup();
  }

  async teardown() {
    await this.prisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${this.schemaId}" CASCADE`,
    );
    await this.prisma.$disconnect();
    return super.teardown();
  }

  private generateUniqueDatabaseURL(schemaId: string) {
    if (!process.env.DATABASE_URL) {
      throw new Error('Please provider a DATABASE_URL environment variable');
    }

    const url = new URL(process.env.DATABASE_URL);

    url.searchParams.set('schema', schemaId);

    return url.toString();
  }
}
