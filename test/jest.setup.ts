import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Saga } from 'src/sagas/entities/saga.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { SmallTalk } from 'src/small-talks/entities/small-talk.entity';

let app: INestApplication;
let dataSource: DataSource;
let usersRepository: Repository<User>;
let sagasRepository: Repository<Saga>;
let episodesRepository: Repository<Episode>;
let commentRepository: Repository<Comment>;
let smallTalkRepository: Repository<SmallTalk>;

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
  episodesRepository = moduleFixture.get<Repository<Episode>>(
    getRepositoryToken(Episode),
  );
  commentRepository = moduleFixture.get<Repository<Comment>>(
    getRepositoryToken(Comment),
  );
  smallTalkRepository = moduleFixture.get<Repository<SmallTalk>>(
    getRepositoryToken(SmallTalk),
  );
  dataSource = moduleFixture.get<DataSource>(DataSource);
  await app.init();
});

afterAll(async () => {
  await dataSource.dropDatabase();
  await dataSource.destroy();
});

export {
  app,
  dataSource,
  usersRepository,
  sagasRepository,
  episodesRepository,
  commentRepository,
  smallTalkRepository,
};
