import * as request from 'supertest';

import { app, smallTalkRepository, usersRepository } from './jest.setup';

const GRAPHQL_ENDPOINT = '/graphql';

test('스몰톡을 생성한다.', async () => {
  let smallTalkId: number;

  const [initialUser] = await usersRepository.find();

  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
          mutation {
            createSmallTalk(
              input: {
                userId: ${initialUser.id}
                title: "제목"
                content: "ㅇㅇ"
                thumbnailUrl: "ddd"
                authorComment: "ㅇㅇ"
                point:300
              }
            ) {
              ok
              error
              smallTalkId
            }
          }
        `,
    })
    .expect(200)
    .expect((res) => {
      const {
        body: {
          data: { createSmallTalk },
        },
      } = res;

      expect(createSmallTalk.ok).toBe(true);
      expect(createSmallTalk.error).toBe(null);
      expect(createSmallTalk.smallTalkId).toEqual(expect.any(Number));

      smallTalkId = createSmallTalk.smallTalkId;
    });

  const smallTalk = await smallTalkRepository.findOne({
    where: { id: smallTalkId },
  });

  expect(smallTalk.title).toBe('제목');
  expect(smallTalk.content).toBe('ㅇㅇ');
  expect(smallTalk.authorComment).toBe('ㅇㅇ');
  expect(smallTalk.point).toBe(300);
});

test('스몰톡을 수정한다.', async () => {
  const [initialSmallTalk] = await smallTalkRepository.find();

  const EDITED = {
    title: '수정1',
    content: '수정2',
    authorComment: '수정3',
    thumbnailUrl: '수정4',
    point: 0,
  };

  expect(initialSmallTalk.title).not.toBe(EDITED.title);
  expect(initialSmallTalk.content).not.toBe(EDITED.content);
  expect(initialSmallTalk.authorComment).not.toBe(EDITED.authorComment);
  expect(initialSmallTalk.point).not.toBe(EDITED.point);
  expect(initialSmallTalk.thumbnailUrl).not.toBe(EDITED.thumbnailUrl);

  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
        mutation {
          editSmallTalk(
            input: {
              smallTalkId: ${initialSmallTalk.id}
              title: "${EDITED.title}"
              content: "${EDITED.content}"
              authorComment: "${EDITED.authorComment}"
              thumbnailUrl: "${EDITED.thumbnailUrl}"
              point: ${EDITED.point}
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
          data: { editSmallTalk },
        },
      } = res;

      expect(editSmallTalk.ok).toBe(true);
      expect(editSmallTalk.error).toBe(null);
    });

  const updatedSmallTalk = await smallTalkRepository.findOne({
    where: { id: initialSmallTalk.id },
  });

  expect(updatedSmallTalk.title).toBe(EDITED.title);
  expect(updatedSmallTalk.content).toBe(EDITED.content);
  expect(updatedSmallTalk.authorComment).toBe(EDITED.authorComment);
  expect(updatedSmallTalk.point).toBe(EDITED.point);
  expect(updatedSmallTalk.thumbnailUrl).toBe(EDITED.thumbnailUrl);
});

test('스몰톡을 삭제한다.', async () => {
  const [initialSmallTalk] = await smallTalkRepository.find();

  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
        mutation {
          deleteSmallTalk(input: { smallTalkId: ${initialSmallTalk.id} }) {
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
          data: { deleteSmallTalk },
        },
      } = res;

      expect(deleteSmallTalk.ok).toBe(true);
      expect(deleteSmallTalk.error).toBe(null);
    });

  const smallTalk = await smallTalkRepository.findOne({
    where: { id: initialSmallTalk.id },
  });

  expect(smallTalk).toBe(null);
});

describe('회차 목록을 불러온다.', () => {
  const TEST_CONTENT_LIST = ['1', '2', '3', '4', '5'];

  const requiredKeys = [
    'id',
    'title',
    'content',
    'authorComment',
    'thumbnailUrl',
    'author',
    'createdAt',
    'updatedAt',
    'interests',
    'likes',
  ];

  beforeAll(async () => {
    const [initialUser] = await usersRepository.find();

    for (const content of TEST_CONTENT_LIST) {
      await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: /* GraphQL */ `
            mutation {
              createSmallTalk(
                input: {
                  userId: ${initialUser.id}
                  title: "${content}"
                  content: "${content}"
                  thumbnailUrl: "${content}"
                  authorComment: "${content}"
                  point: ${content}
                }
              ) {
                ok
                error
                smallTalkId
              }
            }
          `,
        })
        .expect(200);
    }
  });

  test('스몰톡 목록을 불러온다.', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          query {
            getSmallTalkList {
              id
              title
              author {
                id
              }
              thumbnailUrl
              content
              authorComment
              createdAt
              updatedAt
              point
              interests {
                id
              }
              likes {
                id
              }
              comments {
                id
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { getSmallTalkList },
          },
        } = res;

        expect(getSmallTalkList.length).toBe(5);

        requiredKeys.forEach((key) => {
          expect(getSmallTalkList[0]).toHaveProperty(key);
        });
      });
  });

  test('스몰톡 상세 정보를 불러온다.', async () => {
    const [initialSmallTalk] = await smallTalkRepository.find();

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          query {
            getSmallTalkDetail(input: { smallTalk: ${initialSmallTalk.id} }) {
              ok
              error
              data {
                id
                title
                author {
                  id
                }
                thumbnailUrl
                content
                authorComment
                createdAt
                updatedAt
                point
                interests {
                  id
                }
                likes {
                  id
                }
                comments {
                  id
                }
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { getSmallTalkDetail },
          },
        } = res;

        expect(getSmallTalkDetail.ok).toBe(true);
        expect(getSmallTalkDetail.error).toBe(null);

        requiredKeys.forEach((key) => {
          expect(getSmallTalkDetail.data).toHaveProperty(key);
        });

        expect(getSmallTalkDetail.data.title).toBe(initialSmallTalk.title);
      });
  });
});
