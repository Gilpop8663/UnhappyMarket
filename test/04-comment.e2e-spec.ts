import * as request from 'supertest';
import { app, episodesRepository, usersRepository } from './jest.setup';

const GRAPHQL_ENDPOINT = '/graphql';

test('회차의 댓글을 생성한다.', async () => {
  const [initialEpisode] = await episodesRepository.find();
  const [initialUser] = await usersRepository.find();

  const createComment = async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            createComment(
              input: {
                category: Episode
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

  await createComment();
});

test.todo('회차의 댓글을 조회한다.');

test('회차의 댓글을 조회한다.', async () => {
  const [initialEpisode] = await episodesRepository.find();
  const [initialUser] = await usersRepository.find();

  const requiredKeys = [
    'id',
    'user',
    'content',
    'likes',
    'dislikes',
    'updatedAt',
    'createdAt',
    'parent',
    'replies',
    'category',
  ];

  const getCommentList = async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          query {
            getCommentList(input: { category: Episode, episodeId: ${initialEpisode.id} }) {
              ok
              error
              data {
                id
                category
                content
                createdAt
                dislikes
                likes
                parent {
                  id
                }
                replies {
                  id
                }
                updatedAt
                user {
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
            data: { getCommentList },
          },
        } = res;

        expect(getCommentList.data).toEqual(expect.any(Array));
        expect(getCommentList.data.length).toBeGreaterThanOrEqual(1);

        requiredKeys.forEach((key) => {
          expect(getCommentList.data[0]).toHaveProperty(key);
        });
      });
  };

  await getCommentList();
});

test.todo('회차의 댓글을 수정한다.');
test.todo('회차의 댓글을 삭제한다.');
test.todo('댓글에 좋아요를 증가시킨다.');
test.todo('댓글에 좋아요를 감소시킨다.');

test.todo('답글을 생성한다.');
test.todo('답글을 수정한다.');
test.todo('답글을 삭제한다.');
test.todo('답글을 조회한다.');
test.todo('답글을 증가시킨다.');
test.todo('답글을 감소시킨다.');
