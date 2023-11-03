import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import * as request from 'supertest';

describe('Find User By Username (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await prisma.user.create({
      data: {
        email: 'johndoe@example.com',
        lastName: 'Doe',
        firstName: 'John',
        username: 'johndoe',
        password: await hash('123456', 8),
      },
    });

    await app.init();
  });

  test('[GET] /users/:username - should be able to get user', async () => {
    const result = await request(app.getHttpServer()).get('/users/johndoe');

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      user: expect.objectContaining({ username: 'johndoe' }),
    });
  });

  test('[GET] /users/:username - should not be able to get user if username not exists', async () => {
    const result = await request(app.getHttpServer()).get(
      '/users/any-username',
    );

    expect(result.statusCode).toBe(404);
  });
});
