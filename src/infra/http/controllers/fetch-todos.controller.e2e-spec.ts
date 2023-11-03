import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as request from 'supertest';

describe('Fetch todos (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    user = await prisma.user.create({
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

  test('[GET] /users/:id/todos - should be able to fetch todos', async () => {
    await prisma.todo.createMany({
      data: [
        {
          title: 'Todo 1',
          description: 'description todo 1',
          userId: user.id,
        },
        {
          title: 'Todo 2',
          description: 'description todo 2',
          userId: user.id,
        },
      ],
    });

    const result = await request(app.getHttpServer()).get(
      `/users/${user.id}/todos`,
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      todos: expect.arrayContaining([
        expect.objectContaining({ title: 'Todo 1' }),
        expect.objectContaining({ title: 'Todo 2' }),
      ]),
    });
  });
});
