import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as request from 'supertest';

describe('Update Profile (E2E)', () => {
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
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
        username: 'john_doe',
      },
    });

    await app.init();
  });

  test('[PUT] /users/profile - update profile', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const response = await request(app.getHttpServer())
      .put('/users/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        username: 'test',
        is_public: true,
      });

    const changeUsername = await prisma.user.findUnique({
      where: {
        username: 'test',
      },
    });

    expect(response.statusCode).toBe(204);
    expect(changeUsername).toBeTruthy();
    expect(changeUsername.username).toEqual('test');
    expect(changeUsername.isPublic).toBeTruthy();
  });
});
