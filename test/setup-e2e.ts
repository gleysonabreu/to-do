import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import NodeEnvironment from 'jest-environment-node';
import type { JestEnvironmentConfig } from '@jest/environment';
import type { EnvironmentContext } from '@jest/environment';

const prisma = new PrismaClient();

export default class PrismaTestEnvironmentSetup extends NodeEnvironment {
  private schemaId: string;

  constructor(config: JestEnvironmentConfig, _context: EnvironmentContext) {
    super(config, _context);

    this.schemaId = randomUUID();
  }

  async setup() {
    const databaseURL = this.generateUniqueDatabaseURL(this.schemaId);

    process.env.DATABASE_URL = databaseURL;

    execSync('pnpm prisma migrate deploy');
    return super.setup();
  }

  async teardown() {
    await prisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${this.schemaId}" CASCADE`,
    );
    await prisma.$disconnect();
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
