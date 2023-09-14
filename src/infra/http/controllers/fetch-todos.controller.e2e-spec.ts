import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as request from 'supertest';

describe('Fetch todos (E2E)', () => {
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

  test('[GET] /todos - should be able to fetch todos', async () => {
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

    const accessToken = jwt.sign({ sub: user.id });
    const result = await request(app.getHttpServer())
      .get(`/todos`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      todos: [
        expect.objectContaining({ title: 'Todo 1' }),
        expect.objectContaining({ title: 'Todo 2' }),
      ],
    });
  });
});
