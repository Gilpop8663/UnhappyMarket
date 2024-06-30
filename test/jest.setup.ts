import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Saga } from 'src/sagas/entities/saga.entity';

let app: INestApplication;
let dataSource: DataSource;
let usersRepository: Repository<User>;
let sagasRepository: Repository<Saga>;

const GRAPHQL_ENDPOINT = '/graphql';

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  usersRepository = moduleFixture.get<Repository<User>>(
    getRepositoryToken(User),
  );
  sagasRepository = moduleFixture.get<Repository<Saga>>(
    getRepositoryToken(Saga),
  );
  dataSource = moduleFixture.get<DataSource>(DataSource);
  await app.init();

  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
        mutation {
          createAccount(
            input: {
              email: "usett@naver.com"
              nickname: "개미"
              password: "asdfasdf1234"
              userId: "antdesin"
            }
          ) {
            ok
            error
          }
        }
      `,
    });
});

afterAll(async () => {
  await dataSource.dropDatabase();
  await dataSource.destroy();
});

export { app, dataSource, usersRepository, sagasRepository };
