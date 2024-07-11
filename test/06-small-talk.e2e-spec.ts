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
                authorComment: "ㅇㅇ",
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
