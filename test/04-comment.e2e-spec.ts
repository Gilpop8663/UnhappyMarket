import * as request from 'supertest';
import {
  app,
  commentRepository,
  episodesRepository,
  usersRepository,
} from './jest.setup';

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

test('회차의 댓글을 조회한다.', async () => {
  const [initialEpisode] = await episodesRepository.find();

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

        expect(getCommentList.data).toEqual(expect.any(Array));
        expect(getCommentList.data.length).toBeGreaterThanOrEqual(1);

        requiredKeys.forEach((key) => {
          expect(getCommentList.data[0]).toHaveProperty(key);
        });
      });
  };

  await getCommentList();
});

test('회차의 댓글을 수정한다.', async () => {
  const [initialComment] = await commentRepository.find();

  const editContent = '댓글 수정';

  expect(initialComment.content).not.toBe(editContent);

  const editComment = async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            editComment(
              input: {
                commentId: ${initialComment.id}
                content: "${editContent}"
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
            data: { editComment },
          },
        } = res;

        expect(editComment.ok).toBe(true);
        expect(editComment.error).toBe(null);
      });
  };

  await editComment();

  const [updatedComment] = await commentRepository.find();

  expect(updatedComment.content).toBe(editContent);
});

test('회차의 댓글을 삭제한다.', async () => {
  const [initialComment] = await commentRepository.find();

  const deleteComment = async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            deleteComment(
              input: {
                commentId: ${initialComment.id}
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
            data: { deleteComment },
          },
        } = res;

        expect(deleteComment.ok).toBe(true);
        expect(deleteComment.error).toBe(null);
      });
  };

  await deleteComment();

  const deletedComment = await commentRepository.findOne({
    where: { id: initialComment.id },
  });

  expect(deletedComment).toBeNull();
});

describe('댓글 좋아요를 누른다. 댓글 좋아요를 누르기 전 댓글을 생성한다.', () => {
  beforeAll(async () => {
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
        .expect(200);
    };

    for (let i = 0; i < 5; i++) {
      await createComment();
    }
  });

  test('댓글에 좋아요를 증가시킨다. 다시 좋아요를 누르면 좋아요가 취소된다.', async () => {
    const [initialComment] = await commentRepository.find({
      relations: ['user', 'likes'],
    });

    expect(initialComment.likes.length).toBe(0);

    const setCommentLike = async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: /* GraphQL */ `
            mutation {
              setCommentLike(
                input: {
                  commentId: ${initialComment.id}
                  userId: ${initialComment.user.id}
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
              data: { setCommentLike },
            },
          } = res;

          expect(setCommentLike.ok).toBe(true);
          expect(setCommentLike.error).toBe(null);
        });
    };

    await setCommentLike();

    const firstUpdatedComment = await commentRepository.findOne({
      where: { id: initialComment.id },
      relations: ['likes'],
    });

    expect(firstUpdatedComment.likes.length).toBe(1);

    await setCommentLike();

    const secondUpdatedComment = await commentRepository.findOne({
      where: { id: initialComment.id },
      relations: ['likes'],
    });

    expect(secondUpdatedComment.likes.length).toBe(0);
  });
});

test('댓글에 싫어요를 증가시킨다. 다시 싫어요를 누르면 싫어요가 취소된다.', async () => {
  const [initialComment] = await commentRepository.find({
    relations: ['user', 'dislikes'],
  });

  expect(initialComment.dislikes.length).toBe(0);

  const setCommentDislike = async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            setCommentDislike(
              input: {
                commentId: ${initialComment.id}
                userId: ${initialComment.user.id}
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
            data: { setCommentDislike },
          },
        } = res;

        expect(setCommentDislike.ok).toBe(true);
        expect(setCommentDislike.error).toBe(null);
      });
  };

  await setCommentDislike();

  const firstUpdatedComment = await commentRepository.findOne({
    where: { id: initialComment.id },
    relations: ['dislikes'],
  });

  expect(firstUpdatedComment.dislikes.length).toBe(1);

  await setCommentDislike();

  const secondUpdatedComment = await commentRepository.findOne({
    where: { id: initialComment.id },
    relations: ['dislikes'],
  });

  expect(secondUpdatedComment.dislikes.length).toBe(0);
});

test('댓글에 좋아요를 증가시킨다. 그리고 싫어요를 증가시킨다.', async () => {
  const [initialComment] = await commentRepository.find({
    relations: ['user', 'likes', 'dislikes'],
  });

  expect(initialComment.likes.length).toBe(0);
  expect(initialComment.dislikes.length).toBe(0);

  const setCommentLike = async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            setCommentLike(
              input: {
                commentId: ${initialComment.id}
                userId: ${initialComment.user.id}
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
            data: { setCommentLike },
          },
        } = res;

        expect(setCommentLike.ok).toBe(true);
        expect(setCommentLike.error).toBe(null);
      });
  };

  const setCommentDislike = async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            setCommentDislike(
              input: {
                commentId: ${initialComment.id}
                userId: ${initialComment.user.id}
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
            data: { setCommentDislike },
          },
        } = res;

        expect(setCommentDislike.ok).toBe(true);
        expect(setCommentDislike.error).toBe(null);
      });
  };

  await setCommentLike();
  await setCommentDislike();

  const updatedComment = await commentRepository.findOne({
    where: { id: initialComment.id },
    relations: ['likes', 'dislikes'],
  });

  expect(updatedComment.likes.length).toBe(1);
  expect(updatedComment.dislikes.length).toBe(1);
});
