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
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { PasswordResetToken } from 'src/users/entities/passwordResetToken.entity';
import { MailService } from 'src/mail/mail.service';

let app: INestApplication;
let dataSource: DataSource;
let usersRepository: Repository<User>;
let sagasRepository: Repository<Saga>;
let episodesRepository: Repository<Episode>;
let commentRepository: Repository<Comment>;
let smallTalkRepository: Repository<SmallTalk>;
let purchaseRepository: Repository<Purchase>;
let mailService: MailService;
let passwordResetTokenRepository: Repository<PasswordResetToken>;

const originalError = console.error;

const mockMailService = {
  sendEmail: jest.fn().mockReturnValue(true),
  sendVerificationEmail: jest.fn().mockReturnValue(true),
  sendResetPasswordEmail: jest.fn().mockReturnValue(true),
};

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MailService)
    .useValue(mockMailService)
    .compile();

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
  purchaseRepository = moduleFixture.get<Repository<Purchase>>(
    getRepositoryToken(Purchase),
  );
  passwordResetTokenRepository = moduleFixture.get<
    Repository<PasswordResetToken>
  >(getRepositoryToken(PasswordResetToken));

  mailService = moduleFixture.get<MailService>(MailService);

  dataSource = moduleFixture.get<DataSource>(DataSource);
  await app.init();

  console.error = (...args) => {
    const errorMessage = args[0] || '';
    if (
      errorMessage.includes('포인트가 부족합니다.') ||
      errorMessage.includes('유효 기간이 남아 구매할 수 없습니다.')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(async () => {
  await dataSource.dropDatabase();
  await dataSource.destroy();

  console.error = originalError;
});

export {
  app,
  dataSource,
  usersRepository,
  sagasRepository,
  episodesRepository,
  commentRepository,
  smallTalkRepository,
  purchaseRepository,
  mailService,
  passwordResetTokenRepository,
};
