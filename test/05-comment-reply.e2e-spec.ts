import * as request from 'supertest';
import {
  app,
  commentRepository,
  episodesRepository,
  usersRepository,
} from './jest.setup';
import { Comment } from 'src/comments/entities/comment.entity';

const GRAPHQL_ENDPOINT = '/graphql';

describe('답글 생성 후 답글이 생성되었는 지 확인한다', () => {
  let initialCommentId: number;

  test('답글을 생성한다.', async () => {
    const [initialComment] = await commentRepository.find({
      relations: ['episode'],
    });
    initialCommentId = initialComment.id;

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

  test('댓글의 답글을 조회한다.', async () => {
    const initialComment = await commentRepository.findOne({
      where: { id: initialCommentId },
      relations: [
        'replies',
        'replies.user',
        'replies.parent',
        'replies.likes',
        'replies.dislikes',
      ],
    });

    expect(initialComment.replies.length).toBeGreaterThanOrEqual(1);
    expect(initialComment.replies[0].parent.id).toBe(initialCommentId);
  });
});

test('회차의 댓글을 조회한다. 답글인 경우 제외하고 불러온다.', async () => {
  const [initialEpisode] = await episodesRepository.find();

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
                  dislikes{
                    id
                  }
                  likes{
                    id
                  }
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

        getCommentList.data.forEach((comment: Comment) => {
          expect(comment.parent).toBeNull();
        });
      });
  };

  await getCommentList();
});
