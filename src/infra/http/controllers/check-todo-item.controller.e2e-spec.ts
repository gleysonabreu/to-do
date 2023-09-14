import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Todo, User } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as request from 'supertest';

describe('Check Done and UnDone todo item (E2E)', () => {
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

  test('[PATCH] /items/:todoId/done - should be able to done a todo item', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const todoItem = await prisma.todoItem.create({
      data: {
        name: 'test name item',
        description: 'test description item',
        todoId: todo.id,
      },
    });

    const result = await request(app.getHttpServer())
      .patch(`/items/${todoItem.id}/done`)
      .set('Authorization', `Bearer ${accessToken}`);

    const getTodoItem = await prisma.todoItem.findUnique({
      where: {
        id: todoItem.id,
      },
    });

    expect(result.statusCode).toBe(204);
    expect(getTodoItem.check).toBeTruthy();
  });

  test('[PATCH] /items/:todoId/undone - should be able to undone a todo item', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const todoItem = await prisma.todoItem.create({
      data: {
        name: 'test name item',
        description: 'test description item',
        todoId: todo.id,
        check: true,
      },
    });

    const result = await request(app.getHttpServer())
      .patch(`/items/${todoItem.id}/undone`)
      .set('Authorization', `Bearer ${accessToken}`);

    const getTodoItem = await prisma.todoItem.findUnique({
      where: {
        id: todoItem.id,
      },
    });

    expect(result.statusCode).toBe(204);
    expect(getTodoItem.check).toBeFalsy();
  });
  test('[PATCH] /items/:todoId/done - should not be able to done a todo item if todo item not exists', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const result = await request(app.getHttpServer())
      .patch(`/items/any-id/done`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(404);
  });
  test('[PATCH] /items/:todoId/undone - should not be able to undone a todo item if todo item not exists', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const result = await request(app.getHttpServer())
      .patch(`/items/any-id/undone`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(404);
  });
  test('[PATCH] /items/:todoId/done - should not be able to done a todo item if todo is not yours', async () => {
    const user2 = await prisma.user.create({
      data: {
        email: 'johndoe2@example.com',
        lastName: 'Doe',
        firstName: 'John',
        username: 'johndoe2',
        password: await hash('123456', 8),
      },
    });

    const todoItem = await prisma.todoItem.create({
      data: {
        name: 'test name item',
        description: 'test description item',
        todoId: todo.id,
        check: true,
      },
    });

    const accessToken = jwt.sign({ sub: user2.id });
    const result = await request(app.getHttpServer())
      .patch(`/items/${todoItem.id}/done`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(401);
  });
  test('[PATCH] /items/:todoId/undone - should not be able to undone a todo item if todo is not yours', async () => {
    const user3 = await prisma.user.create({
      data: {
        email: 'johndoe3@example.com',
        lastName: 'Doe',
        firstName: 'John',
        username: 'johndoe3',
        password: await hash('123456', 8),
      },
    });

    const todoItem = await prisma.todoItem.create({
      data: {
        name: 'test name item',
        description: 'test description item',
        todoId: todo.id,
        check: true,
      },
    });

    const accessToken = jwt.sign({ sub: user3.id });
    const result = await request(app.getHttpServer())
      .patch(`/items/${todoItem.id}/undone`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(401);
  });
});
