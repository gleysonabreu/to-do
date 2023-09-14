import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Todo, User } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as request from 'supertest';

describe('Create todo item (E2E)', () => {
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

  test('[POST] /todos/:todoId/items - should be able to create a todo item', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const result = await request(app.getHttpServer())
      .post(`/todos/${todo.id}/items`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Todo Item new',
        description: 'new todo item',
      });

    const todoItem = await prisma.todoItem.findFirst({
      where: {
        name: 'Todo Item new',
      },
    });

    expect(result.statusCode).toBe(201);
    expect(todoItem).toBeTruthy();
  });
  test('[POST] /todos/:todoId/items - should not be able to create a todo item if todo not exists', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const result = await request(app.getHttpServer())
      .post(`/todos/any-id/items`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Todo Item new',
        description: 'new todo item',
      });

    expect(result.statusCode).toBe(404);
  });
  test('[POST] /todos/:todoId/items - should not be able to create a todo item if todo is not yours', async () => {
    const otherUser = await prisma.user.create({
      data: {
        email: 'johndoe@example.com.com',
        lastName: 'Doe',
        firstName: 'John',
        username: 'johndoeus',
        password: await hash('123456', 8),
      },
    });

    const accessToken = jwt.sign({ sub: otherUser.id });
    const result = await request(app.getHttpServer())
      .post(`/todos/${todo.id}/items`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Todo Item new',
        description: 'new todo item',
      });

    expect(result.statusCode).toBe(401);
  });
  test('[POST] /todos/:todoId/items - should not be able to create a todo if not proivde a name (description is optional)', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const result = await request(app.getHttpServer())
      .post(`/todos/${todo.id}/items`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        description: 'new todo item',
      });

    expect(result.statusCode).toBe(400);
  });
});
