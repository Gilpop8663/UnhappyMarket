import * as request from 'supertest';
import { app, commentRepository, usersRepository } from './jest.setup';

const GRAPHQL_ENDPOINT = '/graphql';
test('답글을 생성한다.', async () => {
  const [initialComment] = await commentRepository.find({
    relations: ['episode'],
  });
  const [initialUser] = await usersRepository.find();

  const createCommentReply = async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
            mutation {
              createCommentReply(
                input: {
                  content: "답글 생성"
                  commentId: ${initialComment.id}
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
            data: { createCommentReply },
          },
        } = res;

        expect(createCommentReply.ok).toBe(true);
        expect(createCommentReply.error).toBe(null);
        expect(createCommentReply.commentId).toEqual(expect.any(Number));
      });
  };

  await createCommentReply();
});

test.todo('답글을 수정한다.');
test.todo('답글을 삭제한다.');
test.todo('답글을 조회한다.');
test.todo('답글을 증가시킨다.');
test.todo('답글을 감소시킨다.');
