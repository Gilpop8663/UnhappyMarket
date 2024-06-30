import * as request from 'supertest';

import { app, sagasRepository, usersRepository } from './jest.setup';

const GRAPHQL_ENDPOINT = '/graphql';

let userId: number;

describe('시리즈를 생성한다.', () => {
  beforeAll(async () => {
    const [user] = await usersRepository.find();

    userId = user.id;
  });

  test('시리즈를 생성한다.', async () => {
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

describe('시리즈를 삭제한다', () => {
  let sagaId: number;

  beforeAll(async () => {
    const [saga] = await sagasRepository.find();
    sagaId = saga.id;
  });

  test('시리즈를 삭제한다.', async () => {
    await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            deleteSaga(input: { sagaId: ${sagaId} }) {
              ok
              error
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { deleteSaga },
          },
        } = res;

        expect(deleteSaga.ok).toBe(true);
        expect(deleteSaga.error).toBe(null);
      });

    const saga = await sagasRepository.findOne({ where: { id: sagaId } });

    expect(saga).toBeNull();
  });
});

describe('시리즈를 수정한다', () => {
  test('시리즈를 수정한다.', async () => {
    const res = await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            createSaga(
              input: {
                title: "새로 생성"
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
      .expect(200);

    const {
      body: {
        data: { createSaga },
      },
    } = res;

    const saga = await sagasRepository.findOne({
      where: { id: createSaga.sagaId },
    });

    await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            editSaga(
              input: {
                sagaId: ${saga.id}
                description: "수정1"
                thumbnailUrl: "수정2"
                title: "수정3"
              }
            ) {
              ok
              error
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { editSaga },
          },
        } = res;

        expect(editSaga.ok).toBe(true);
        expect(editSaga.error).toBe(null);
      });

    const updatedSaga = await sagasRepository.findOne({
      where: { id: saga.id },
    });

    expect(updatedSaga.description).toBe('수정1');
    expect(updatedSaga.thumbnailUrl).toBe('수정2');
    expect(updatedSaga.title).toBe('수정3');
  });
});

describe('시리즈 목록을 불러온다', () => {
  test('시리즈 목록을 불러온다.', async () => {
    const requiredKeys = [
      'id',
      'title',
      'description',
      'category',
      'createdAt',
      'updatedAt',
      'thumbnailUrl',
      'author',
    ];

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          query {
            getSagaList {
              id
              title
              description
              category
              createdAt
              updatedAt
              thumbnailUrl
              author {
                id
                nickname
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { getSagaList },
          },
        } = res;

        expect(getSagaList).toEqual(expect.any(Array));
        expect(getSagaList.length).toBeGreaterThanOrEqual(1);
        requiredKeys.forEach((key) => {
          expect(getSagaList[0]).toHaveProperty(key);
        });
      });
  });
});
