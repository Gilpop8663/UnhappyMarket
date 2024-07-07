import * as request from 'supertest';
import { app, episodesRepository, usersRepository } from './jest.setup';

const GRAPHQL_ENDPOINT = '/graphql';

test.todo('회차의 댓글을 생성한다.');

test('회차의 댓글을 생성한다.', async () => {
  const [initialEpisode] = await episodesRepository.find();
  const [initialUser] = await usersRepository.find();

  const increaseViewCount = async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            createComment(
              input: {
                category: Challenge
                content: "댓글 생성"
                episodeId: ${initialEpisode.id}
                userId: ${initialUser.id}
              }
            ) {
              ok
              error
              commentId
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { createComment },
          },
        } = res;

        expect(createComment.ok).toBe(true);
        expect(createComment.error).toBe(null);
        expect(createComment.commentId).toBe(1);
      });
  };

  await increaseViewCount();
});
test.todo('회차의 댓글을 수정한다.');
test.todo('회차의 댓글을 삭제한다.');
test.todo('회차의 댓글을 조회한다.');
test.todo('댓글에 좋아요를 증가시킨다.');
test.todo('댓글에 좋아요를 감소시킨다.');

test.todo('답글을 생성한다.');
test.todo('답글을 수정한다.');
test.todo('답글을 삭제한다.');
test.todo('답글을 조회한다.');
test.todo('답글을 증가시킨다.');
test.todo('답글을 감소시킨다.');
