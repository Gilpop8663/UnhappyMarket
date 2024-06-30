import * as request from 'supertest';

import { app, usersRepository } from './jest.setup';

const GRAPHQL_ENDPOINT = '/graphql';

test.todo('시리즈를 생성한다.');

describe('시리즈를 생성한다.', () => {
  let userId: number;

  beforeAll(async () => {
    const [user] = await usersRepository.find();
    userId = user.id;
  });

  test('시리즈를 생성한다.', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          # Write your query or mutation here
          mutation {
            createSaga(
              input: {
                title: "aa"
                category: Challenge
                description: "sss"
                thumbnailUrl: "ddd"
                userId: ${userId}
              }
            ) {
              ok
              error
              sagaId
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { createSaga },
          },
        } = res;

        expect(createSaga.ok).toBe(true);
        expect(createSaga.error).toBe(null);
        expect(createSaga.sagaId).toBe(1);
      });
  });

  test('시리즈를 생성하는데 유저 정보가 잘못되었을 때 에러를 반환한다.', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          # Write your query or mutation here
          mutation {
            createSaga(
              input: {
                title: "aa"
                category: Challenge
                description: "sss"
                thumbnailUrl: "ddd"
                userId: -1
              }
            ) {
              ok
              error
              sagaId
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { createSaga },
          },
        } = res;

        expect(createSaga.ok).toBe(false);
        expect(createSaga.error).toBe('유저를 찾지 못했습니다');
        expect(createSaga.sagaId).toBe(null);
      });
  });

  test('시리즈를 생성하는데 필수 값 입력을 하지 않으면 에러를 반환한다.', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          # Write your query or mutation here
          mutation {
            createSaga(
              input: {
                title: "aa"
                category: Challenge
                thumbnailUrl: "ddd"
                userId: ${userId}
              }
            ) {
              ok
              error
              sagaId
            }
          }
        `,
      })
      .expect(400);
  });
});

test.todo('시리즈를 삭제한다.');
test.todo('시리즈를 수정한다.');
test.todo('시리즈 목록을 불러온다.');
