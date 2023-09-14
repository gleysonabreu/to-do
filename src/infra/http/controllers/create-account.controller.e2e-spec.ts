import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

describe('Create Account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /users - create a user', async () => {
    const result = await request(app.getHttpServer()).post('/users').send({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    });

    expect(result.statusCode).toBe(201);
    expect(user).toBeTruthy();
  });

  test('[POST] /users - should not create a user if email already exists', async () => {
    const result = await request(app.getHttpServer()).post('/users').send({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.statusCode).toBe(409);
    expect(result.body.message).toEqual('User "johndoe@example.com" already exists.');
  });

  test('[POST] /users - should not create a user if username already exists', async () => {
    const result = await request(app.getHttpServer()).post('/users').send({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'johndoe@example.com.br',
      password: '123456',
    });

    expect(result.statusCode).toBe(409);
    expect(result.body.message).toEqual('User "johndoe" already exists.');
  });

  test('[POST] /users - should not create a user if not provide firstName, lastName, password, email or username', async () => {
    const result = await request(app.getHttpServer()).post('/users').send({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: '123456',
    });

    expect(result.statusCode).toBe(400);
  });
  test('[POST] /users - should not create a user if email is not a email', async () => {
    const result = await request(app.getHttpServer()).post('/users').send({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'johndoe',
      password: '123456',
    });

    expect(result.statusCode).toBe(400);
  });
});
