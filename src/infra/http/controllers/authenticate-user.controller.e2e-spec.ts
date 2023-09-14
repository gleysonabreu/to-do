import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import * as request from 'supertest';

describe('Authenticate (E2E)', () => {
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
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
        username: 'john_doe',
      },
    });

    await app.init();
  });

  test('[POST] /auth - create token to auth user', async () => {
    const response = await request(app.getHttpServer()).post('/auth').send({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });

  test('[POST] /auth - should not authenticate user if not provide email', async () => {
    const response = await request(app.getHttpServer()).post('/auth').send({
      password: '123456',
    });

    expect(response.statusCode).toBe(400);
  });

  test('[POST] /auth - should not authenticate user if not provide password', async () => {
    const response = await request(app.getHttpServer()).post('/auth').send({
      email: 'any-email@example.com',
    });

    expect(response.statusCode).toBe(400);
  });

  test('[POST] /auth - should not authenticate user if provide wrong email', async () => {
    const response = await request(app.getHttpServer()).post('/auth').send({
      email: 'any-email@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(401);
  });

  test('[POST] /auth - should not authenticate user if provide wrong password', async () => {
    const response = await request(app.getHttpServer()).post('/auth').send({
      email: 'johndoe@example.com',
      password: 'any-password',
    });

    expect(response.statusCode).toBe(401);
  });

  test('[POST] /auth - should not authenticate user if email is not an email', async () => {
    const response = await request(app.getHttpServer()).post('/auth').send({
      email: 'wrong-email-format',
      password: '123456',
    });

    expect(response.statusCode).toBe(400);
  });
});
