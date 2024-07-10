import * as request from 'supertest';

import {
  app,
  episodesRepository,
  sagasRepository,
  usersRepository,
} from './jest.setup';
import { InterestableType } from 'src/interests/entities/interest.entity';
import { LikeableType } from 'src/likes/entities/like.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';

const GRAPHQL_ENDPOINT = '/graphql';

let sagaId: number;
let episodeId: number;

describe('회차를 생성한다.', () => {
  beforeAll(async () => {
    const [saga] = await sagasRepository.find();

    sagaId = saga.id;
  });

  test('회차를 생성한다.', async () => {
    await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            createEpisode(
              input: {
                sagaId: ${sagaId}
                title: "제목"
                content: "ㅇㅇ"
                authorComment: "ㅇㅇ",
                point:300
              }
            ) {
              ok
              error
              episodeId
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { createEpisode },
          },
        } = res;

        expect(createEpisode.ok).toBe(true);
        expect(createEpisode.error).toBe(null);
        expect(createEpisode.episodeId).toEqual(expect.any(Number));

        episodeId = createEpisode.episodeId;
      });

    const episode = await episodesRepository.findOne({
      where: { id: episodeId },
    });

    expect(episode.title).toBe('제목');
    expect(episode.content).toBe('ㅇㅇ');
    expect(episode.authorComment).toBe('ㅇㅇ');
    expect(episode.point).toBe(300);
  });
});

test('회차를 수정한다.', async () => {
  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
        mutation {
          editEpisode(
            input: {
              episodeId: ${episodeId}
              title: "수정1"
              content: "수정2"
              authorComment: "수정3"
              point:0
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
          data: { editEpisode },
        },
      } = res;

      expect(editEpisode.ok).toBe(true);
      expect(editEpisode.error).toBe(null);
    });

  const updatedEpisode = await episodesRepository.findOne({
    where: { id: episodeId },
  });

  expect(updatedEpisode.title).toBe('수정1');
  expect(updatedEpisode.content).toBe('수정2');
  expect(updatedEpisode.authorComment).toBe('수정3');
  expect(updatedEpisode.point).toBe(0);
});

test('회차를 삭제한다.', async () => {
  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
        mutation {
          deleteEpisode(input: { episodeId: ${episodeId} }) {
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
          data: { deleteEpisode },
        },
      } = res;

      expect(deleteEpisode.ok).toBe(true);
      expect(deleteEpisode.error).toBe(null);
    });

  const episodeList = await episodesRepository.find();

  expect(episodeList.length).toBe(0);
});

describe('회차 목록을 불러온다.', () => {
  const TEST_CONTENT_LIST = ['1', '2', '3', '4', '5'];

  const requiredKeys = [
    'id',
    'title',
    'content',
    'authorComment',
    'createdAt',
    'updatedAt',
    'interests',
    'likes',
  ];

  beforeAll(async () => {
    for (const content of TEST_CONTENT_LIST) {
      await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: /* GraphQL */ `
          mutation {
            createEpisode(
              input: {
                sagaId: ${sagaId}
                title: "${content}"
                content: "${content}"
                authorComment: "${content}"
                point:500
              }
            ) {
              ok
              error
              episodeId
            }
          }
        `,
        });
    }
  });

  test('회차 목록을 불러온다.', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          query {
            getEpisodeList(sagaId: ${sagaId}) {
              id
              title
              content
              authorComment
              createdAt
              updatedAt
              point
              interests{
                  id
                }
              likes{
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
            data: { getEpisodeList },
          },
        } = res;

        expect(getEpisodeList.length).toBe(5);

        requiredKeys.forEach((key) => {
          expect(getEpisodeList[0]).toHaveProperty(key);
        });
      });
  });
});

describe('회차 상세 정보를 불러온다.', () => {
  const requiredKeys = [
    'id',
    'title',
    'content',
    'authorComment',
    'point',
    'createdAt',
    'updatedAt',
    'interests',
    'likes',
    'saga',
  ];

  test('회차 상세 정보를 불러온다.', async () => {
    const [episode] = await episodesRepository.find();
    const [initialUser] = await usersRepository.find();

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          query {
            getEpisodeDetail(input: { episodeId: ${episode.id},userId:${initialUser.id} }) {
              ok
              episode {
                id
                title
                content
                authorComment
                createdAt
                updatedAt
                point
                interests{
                  id
                }
                likes {
                  id
                }
                saga {
                  id
                  title
                }
              }
              nextEpisode {
                id
                title
              }
              previousEpisode {
                id
                title
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { getEpisodeDetail },
          },
        } = res;

        expect(getEpisodeDetail.ok).toBe(true);

        requiredKeys.forEach((key) => {
          expect(getEpisodeDetail.episode).toHaveProperty(key);
        });

        expect(getEpisodeDetail.previousEpisode).toBeNull();
        expect(getEpisodeDetail.episode.title).toBe('1');
        expect(getEpisodeDetail.nextEpisode.title).toBe('2');
      });
  });

  test('회차 상세 정보를 불러온다. 회차가 유료라면 회원의 포인트를 차감한다.', async () => {
    const [episode] = await episodesRepository.find();
    const [initialUser] = await usersRepository.find();

    expect(initialUser.point).toBeGreaterThanOrEqual(episode.point);

    await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          query {
            getEpisodeDetail(input: { episodeId: ${episode.id},userId:${initialUser.id} }) {
              ok
              episode {
                id
              }
              nextEpisode {
                id
                title
              }
              previousEpisode {
                id
                title
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { getEpisodeDetail },
          },
        } = res;

        expect(getEpisodeDetail.ok).toBe(true);
      });
    const updatedUser = await usersRepository.findOne({
      where: { id: initialUser.id },
    });

    expect(updatedUser.point).toBe(initialUser.point - episode.point);
  });

  const editEpisode = async (episode: Episode, point: number) => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
    mutation {
      editEpisode(
        input: {
          episodeId: ${episode.id}
          point:${point}
        }
      ) {
        ok
        error
      }
    }
  `,
      })
      .expect(200);
  };

  test('회차 상세 정보를 불러온다. 회차가 유료이고 유저의 포인트가 부족하다면 에러 메세지를 보낸다.', async () => {
    const episode = await episodesRepository.findOne({ where: { id: 2 } });
    const [initialUser] = await usersRepository.find();

    await editEpisode(episode, initialUser.point + 100);

    const updatedEpisode = await episodesRepository.findOne({
      where: { id: episode.id },
    });

    expect(initialUser.point).toBeLessThan(updatedEpisode.point);

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          query {
            getEpisodeDetail(input: { episodeId: ${episode.id} ,userId:${initialUser.id}}) {
              ok
              error
              episode {
                id
              }
              nextEpisode {
                id
                title
              }
              previousEpisode {
                id
                title
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { getEpisodeDetail },
          },
        } = res;

        expect(getEpisodeDetail.ok).toBe(false);
        expect(getEpisodeDetail.error).toBe('포인트가 부족합니다.');
      });
  });

  test('회차 상세 정보를 불러온다. 회차가 무료라면 포인트를 차감하지 않고, 비회원도 조회할 수 있다.', async () => {
    const episode = await episodesRepository.findOne({ where: { id: 2 } });

    await editEpisode(episode, 0);

    const updatedEpisode = await episodesRepository.findOne({
      where: { id: episode.id },
    });

    expect(updatedEpisode.point).toBe(0);

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          query {
            getEpisodeDetail(input: { episodeId: ${episode.id},userId:null }) {
              ok
              episode {
                id
              }
              nextEpisode {
                id
                title
              }
              previousEpisode {
                id
                title
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { getEpisodeDetail },
          },
        } = res;

        expect(getEpisodeDetail.ok).toBe(true);
      });
  });

  test('2번째에 위치한 회차를 불러온 뒤, 이전 회차, 다음 회차 정보를 확인한다.', async () => {
    const [__, episode] = await episodesRepository.find({
      order: { createdAt: 'ASC' },
    });

    await editEpisode(episode, 0);

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          query {
            getEpisodeDetail(input: { episodeId: ${episode.id} }) {
              ok
              episode {
                id
                title
                content
                authorComment
                createdAt
                updatedAt
                point
                interests{
                  id
                }
                likes {
                  id
                }
                saga {
                  id
                  title
                }
              }
              nextEpisode {
                id
                title
              }
              previousEpisode {
                id
                title
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { getEpisodeDetail },
          },
        } = res;

        expect(getEpisodeDetail.episode.title).toBe('2');
        expect(getEpisodeDetail.previousEpisode.title).toBe('1');
        expect(getEpisodeDetail.nextEpisode.title).toBe('3');
      });
  });

  test('마지막 위치한 회차를 불러온 뒤, 이전 회차, 다음 회차 정보를 확인한다.', async () => {
    const episode = (
      await episodesRepository.find({ order: { createdAt: 'ASC' } })
    ).at(-1);

    await editEpisode(episode, 0);

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          query {
            getEpisodeDetail(input: { episodeId: ${episode.id} }) {
              ok
              episode {
                id
                title
                content
                authorComment
                createdAt
                updatedAt
                point
                interests{
                  id
                }
                likes {
                  id
                }
                saga {
                  id
                  title
                }
              }
              nextEpisode {
                id
                title
              }
              previousEpisode {
                id
                title
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { getEpisodeDetail },
          },
        } = res;

        expect(getEpisodeDetail.episode.title).toBe('5');
        expect(getEpisodeDetail.previousEpisode.title).toBe('4');
        expect(getEpisodeDetail.nextEpisode).toBeNull();
      });
  });

  test('3번째 위치한 회차를 불러온 뒤, 2번째를 삭제한 후 이전 회차, 다음 회차 정보를 확인한다.', async () => {
    const [__, second, episode] = await episodesRepository.find({
      order: { createdAt: 'ASC' },
    });

    await editEpisode(episode, 0);

    await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            deleteEpisode(input: { episodeId: ${second.id} }) {
              ok
              error
            }
          }
        `,
      });

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          query {
            getEpisodeDetail(input: { episodeId: ${episode.id} }) {
              ok
              episode {
                id
                title
                content
                authorComment
                createdAt
                updatedAt
                point
                interests{
                  id
                }
                likes {
                  id
                }
                saga {
                  id
                  title
                }
              }
              nextEpisode {
                id
                title
              }
              previousEpisode {
                id
                title
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: {
            data: { getEpisodeDetail },
          },
        } = res;

        expect(getEpisodeDetail.episode.title).toBe('3');
        expect(getEpisodeDetail.previousEpisode.title).toBe('1');
        expect(getEpisodeDetail.nextEpisode.title).toBe('4');
      });
  });
});

test('회차 좋아요를 누른다. 다시 한번 누르면 좋아요가 취소된다.', async () => {
  const [initialEpisode] = await episodesRepository.find();
  const [initialUser] = await usersRepository.find();

  const setEpisodeLike = async (episodeId: number, userId: number) => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            setEpisodeLike(input: { episodeId: ${episodeId}, userId: ${userId} }) {
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
            data: { setEpisodeLike },
          },
        } = res;

        expect(setEpisodeLike.ok).toBe(true);
        expect(setEpisodeLike.error).toBe(null);
      });
  };

  const getEpisode = async (episodeId: number) => {
    return episodesRepository.findOne({
      where: { id: episodeId },
      relations: ['likes'],
    });
  };

  const getUserLikeLength = async () => {
    const user = await usersRepository.findOne({
      where: { id: initialUser.id },
      relations: ['likes'],
    });

    return user.likes.filter(
      (item) => item.likeableType === LikeableType['Episode'],
    ).length;
  };

  // 좋아요 등록
  await setEpisodeLike(initialEpisode.id, initialUser.id);

  // 좋아요 등록 후 확인
  const episodeAfterFirstLike = await getEpisode(initialEpisode.id);
  const userAfterFirstLike = await getUserLikeLength();

  expect(episodeAfterFirstLike.likes.length).toBe(1);
  expect(userAfterFirstLike).toBe(1);

  // 좋아요 취소
  await setEpisodeLike(initialEpisode.id, initialUser.id);

  // 좋아요 취소 후 확인
  const episodeAfterSecondLike = await getEpisode(initialEpisode.id);
  const userAfterSecondLike = await getUserLikeLength();

  expect(episodeAfterSecondLike.likes.length).toBe(0);
  expect(userAfterSecondLike).toBe(0);
});

test('회차 관심 있어요를 누른다. 다시 한번 누르면 관심이 취소된다.', async () => {
  const [initialEpisode] = await episodesRepository.find();
  const [initialUser] = await usersRepository.find();

  const setEpisodeInterest = async (episodeId: number, userId: number) => {
    await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            setEpisodeInterest(input: { episodeId: ${episodeId}, userId: ${userId} }) {
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
            data: { setEpisodeInterest },
          },
        } = res;
        expect(setEpisodeInterest.ok).toBe(true);
        expect(setEpisodeInterest.error).toBe(null);
      });
  };

  const getEpisode = async (episodeId: number) => {
    return episodesRepository.findOne({
      where: { id: episodeId },
      relations: ['interests'],
    });
  };

  const getUserInterestLength = async () => {
    const user = await usersRepository.findOne({
      where: { id: initialUser.id },
      relations: ['interests'],
    });

    return user.interests.filter(
      (item) => item.interestableType === InterestableType['Episode'],
    ).length;
  };

  // 관심 등록
  await setEpisodeInterest(initialEpisode.id, initialUser.id);

  // 관심 등록 후 확인
  const episodeAfterFirstInterest = await getEpisode(initialEpisode.id);
  const userAfterFirstInterest = await getUserInterestLength();

  expect(episodeAfterFirstInterest.interests.length).toBe(1);
  expect(userAfterFirstInterest).toBe(1);

  // 관심 취소
  await setEpisodeInterest(initialEpisode.id, initialUser.id);

  // 관심 취소 후 확인
  const episodeAfterSecondInterest = await getEpisode(initialEpisode.id);
  const userAfterSecondInterest = await getUserInterestLength();

  expect(episodeAfterSecondInterest.interests.length).toBe(0);
  expect(userAfterSecondInterest).toBe(0);
});

test('회차를 조회하면 조회수가 증가한다.', async () => {
  const [initialEpisode] = await episodesRepository.find();

  // 초기 조회수 확인
  const initialViewCount = initialEpisode.views;

  const increaseViewCount = async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
      mutation {
        increaseEpisodeViewCount(input: { episodeId: ${initialEpisode.id} }) {
          ok
          error
        }
      }
    `,
      })
      .expect(200);
  };

  // 회차 조회 요청
  await increaseViewCount();

  // 조회 후 조회수 확인
  const updatedEpisode = await episodesRepository.findOne({
    where: { id: initialEpisode.id },
  });
  const updatedViewCount = updatedEpisode.views;

  // 조회수가 1 증가했는지 확인
  expect(updatedViewCount).toBe(initialViewCount + 1);
});

test('회차를 조회하면 조회수가 증가한다.', async () => {
  const [initialEpisode] = await episodesRepository.find();

  // 초기 조회수 확인
  const initialViewCount = initialEpisode.views;

  const increaseViewCount = async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
      mutation {
        increaseEpisodeViewCount(input: { episodeId: ${initialEpisode.id} }) {
          ok
          error
        }
      }
    `,
      })
      .expect(200);
  };

  // 회차 조회 요청
  await increaseViewCount();

  // 조회 후 조회수 확인
  const updatedEpisode = await episodesRepository.findOne({
    where: { id: initialEpisode.id },
  });
  const updatedViewCount = updatedEpisode.views;

  // 조회수가 1 증가했는지 확인
  expect(updatedViewCount).toBe(initialViewCount + 1);
});

test.todo('조회수 중복해서 오르지 않도록 확인하기');
