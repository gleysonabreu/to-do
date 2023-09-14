import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as request from 'supertest';

describe('Get Todo By Id (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: User;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

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

  test('[GET] /todos/:todoId - should be able to get todo', async () => {
    const todo = await prisma.todo.create({
      data: {
        title: 'Todo 1',
        description: 'description todo 1',
        userId: user.id,
      },
    });

    const accessToken = jwt.sign({ sub: user.id });
    const result = await request(app.getHttpServer())
      .get(`/todos/${todo.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      todo: expect.objectContaining({ title: 'Todo 1' }),
    });
  });

  test('[GET] /todo/:todoId - should not be able to get todo if todo not exists', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const result = await request(app.getHttpServer())
      .get(`/todos/any-todo-id`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(404);
  });

  test('[GET] /todo/:todoId - should not be able to get todo if todo is not yours', async () => {
    const userOther = await prisma.user.create({
      data: {
        email: 'johndoe@example.com.ai',
        lastName: 'Doe',
        firstName: 'John',
        username: 'johndoe.ai',
        password: await hash('123456', 8),
      },
    });

    const todo = await prisma.todo.create({
      data: {
        title: 'Todo 1',
        description: 'description todo 1',
        userId: user.id,
      },
    });

    const accessToken = jwt.sign({ sub: userOther });
    const result = await request(app.getHttpServer())
      .get(`/todos/${todo.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(401);
  });
});
