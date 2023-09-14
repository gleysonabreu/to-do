import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as request from 'supertest';

describe('Create todo (E2E)', () => {
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

  test('[POST] /todos - should be able to create a todo', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const result = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Title new',
        description: 'new todo',
      });

    const todoOnDB = await prisma.todo.findFirst({
      where: {
        title: 'Title new',
      },
    });

    expect(result.statusCode).toBe(201);
    expect(todoOnDB).toBeTruthy();
  });

  test('[POST] /todos - should not be able to create a todo if user not auth', async () => {
    const result = await request(app.getHttpServer()).post('/todos').send({
      title: 'Title new',
      description: 'new todo',
    });

    expect(result.statusCode).toBe(401);
  });

  test('[POST] /todos - should not be able to create a todo if not provide title or description(optional)', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const result = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        description: 'new todo',
      });

    expect(result.statusCode).toBe(400);
  });
});
