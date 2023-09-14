import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Todo, User } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as request from 'supertest';

describe('Delete todo (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: User;
  let todo: Todo;
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

    todo = await prisma.todo.create({
      data: {
        title: 'First todo',
        description: 'hi',
        userId: user.id,
      },
    });

    await app.init();
  });

  test('[DELETE] /todos/:todoId - should be able to delete a todo', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const result = await request(app.getHttpServer())
      .delete(`/todos/${todo.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    const todos = await prisma.todo.findMany({
      where: {
        userId: user.id,
      },
    });

    expect(result.statusCode).toBe(204);
    expect(todos.length).toEqual(0);
  });
  test('[DELETE] /todos/:todoId - should not be able to delete a todo if todo not exists', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const result = await request(app.getHttpServer())
      .delete(`/todos/any-id`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(404);
  });

  test('[DELETE] /todos/:todoId - should not be able to delete a todo if todo is not yours', async () => {
    const otherUser = await prisma.user.create({
      data: {
        email: 'johndoe@example.com.other',
        lastName: 'Doe',
        firstName: 'John',
        username: 'johndoe.other',
        password: await hash('123456', 8),
      },
    });

    const otherTodo = await prisma.todo.create({
      data: {
        title: 'Second todo',
        description: 'hi',
        userId: user.id,
      },
    });

    const accessToken = jwt.sign({ sub: otherUser.id });
    const result = await request(app.getHttpServer())
      .delete(`/todos/${otherTodo.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(401);
  });
});
