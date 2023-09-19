import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as request from 'supertest';

describe('Get Current User (E2E)', () => {
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
        username: 'john_doe',
        password: await hash('123456', 8),
      },
    });

    await app.init();
  });

  test('[GET] /me - should be able get current user', async () => {
    const accessToken = jwt.sign({ sub: user.id });
    const result = await request(app.getHttpServer())
      .get('/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      user: expect.objectContaining({ id: user.id }),
    });
  });
});
