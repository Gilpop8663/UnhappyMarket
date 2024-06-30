import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { Verification } from './users/entities/verification.entity';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/comment.entity';
import { CommentReply } from './comments/entities/comment-reply.entity';
import { SagasModule } from './sagas/sagas.module';
import { Saga } from './sagas/entities/saga.entity';
import { Episode } from './sagas/episodes/entities/episode.entity';
import { LikesModule } from './likes/likes.module';
import { Like } from './likes/entities/like.entity';

const getEnvFilePath = () => {
  if (process.env.NODE_ENV === 'dev') {
    return '.env.dev';
  }

  if (process.env.NODE_ENV === 'production') {
    return '.env';
  }

  if (process.env.NODE_ENV === 'test') {
    return '.env.test';
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: getEnvFilePath(),
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'production', 'test')
          .default('dev'),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string(),
        DB_DATABASE_NAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        JWT_SECRET_KEY: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',

      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE_NAME,
          }),
      entities: [
        User,
        Verification,
        Comment,
        CommentReply,
        Saga,
        Episode,
        Like,
      ],
      logging: process.env.NODE_ENV === 'dev',
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ user: req['user'] }),
      introspection: true,
      playground: true,
    }),
    UsersModule,
    CommonModule,
    JwtModule.forRoot({
      secretKey: process.env.JWT_SECRET_KEY,
    }),
    AuthModule,
    CommentsModule,
    SagasModule,
    LikesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}