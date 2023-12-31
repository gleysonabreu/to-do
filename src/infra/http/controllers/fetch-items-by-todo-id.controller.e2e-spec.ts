import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Todo, User } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as request from 'supertest';

describe('Fetch items by todo id (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: User;
  let todo: Todo;

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

    todo = await prisma.todo.create({
      data: {
        title: 'First todo',
        description: 'hi',
        userId: user.id,
      },
    });

    await app.init();
  });

  test('[GET] /todos/:todoId/items - should be able to fetch todo items', async () => {
    await prisma.todoItem.createMany({
      data: [
        {
          name: 'Todo item',
          description: 'todo description',
          todoId: todo.id,
        },
        {
          name: 'Todo item 2',
          description: 'todo description 2',
          todoId: todo.id,
        },
      ],
    });

    const result = await request(app.getHttpServer()).get(
      `/todos/${todo.id}/items`,
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      todo_items: [
        expect.objectContaining({ name: 'Todo item' }),
        expect.objectContaining({ name: 'Todo item 2' }),
      ],
    });
  });

  test('[GET] /todos/:todoId/items - should not be able to fetch items if todo not exists', async () => {
    const result = await request(app.getHttpServer()).get(
      `/todos/any-todo-id/items`,
    );

    expect(result.statusCode).toBe(404);
  });
});
