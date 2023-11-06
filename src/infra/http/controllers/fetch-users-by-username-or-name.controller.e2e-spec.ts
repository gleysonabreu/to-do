import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import * as request from 'supertest';

describe('Fetch Users By Username or Name (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await prisma.user.createMany({
      data: [
        {
          email: 'johndoe@example.com',
          lastName: 'Doe',
          firstName: 'John',
          username: 'johndoe',
          password: await hash('123456', 8),
        },
        {
          email: 'noing@example.com',
          lastName: 'noing',
          firstName: 'nor',
          username: 'nor',
          password: await hash('123456', 8),
        },
      ],
    });

    await app.init();
  });

  test('[GET] /users?q= - should be able to fetch users by username', async () => {
    const result = await request(app.getHttpServer()).get(`/users?q=john`);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      users: expect.arrayContaining([
        expect.objectContaining({ username: 'johndoe' }),
      ]),
    });
  });

  test('[GET] /users?q= - should be able to fetch users by first name', async () => {
    const result = await request(app.getHttpServer()).get(`/users?q=John`);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      users: expect.arrayContaining([
        expect.objectContaining({ first_name: 'John' }),
      ]),
    });
  });

  test('[GET] /users?q= - should be able to fetch users by last name', async () => {
    const result = await request(app.getHttpServer()).get(`/users?q=Doe`);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      users: expect.arrayContaining([
        expect.objectContaining({ last_name: 'Doe' }),
      ]),
    });
  });
});
