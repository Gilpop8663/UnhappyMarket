import * as request from 'supertest';

import { app, episodesRepository, sagasRepository } from './jest.setup';

const GRAPHQL_ENDPOINT = '/graphql';

let sagaId: number;

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
                authorComment: "ㅇㅇ"
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
        expect(createEpisode.episodeId).toBe(1);
      });

    const episode = await episodesRepository.findOne({ where: { id: 1 } });

    expect(episode.title).toBe('제목');
    expect(episode.content).toBe('ㅇㅇ');
    expect(episode.authorComment).toBe('ㅇㅇ');
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
              episodeId: 1
              title: "수정1"
              content: "수정2"
              authorComment: "수정3"
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

  const updatedEpisode = await episodesRepository.findOne({ where: { id: 1 } });

  expect(updatedEpisode.title).toBe('수정1');
  expect(updatedEpisode.content).toBe('수정2');
  expect(updatedEpisode.authorComment).toBe('수정3');
});

test('회차를 삭제한다.', async () => {
  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
        mutation {
          deleteEpisode(input: { episodeId: 1 }) {
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
              interests
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
    'createdAt',
    'updatedAt',
    'interests',
    'likes',
    'saga',
  ];

  test('회차 상세 정보를 불러온다.', async () => {
    const [episode] = await episodesRepository.find();

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
                interests
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

  test('2번째에 위치한 회차를 불러온 뒤, 이전 회차, 다음 회차 정보를 확인한다.', async () => {
    const [__, episode] = await episodesRepository.find();

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
                interests
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
    const episode = (await episodesRepository.find()).at(-1);

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
                interests
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
    const [__, second, episode] = await episodesRepository.find();

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
                interests
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

  const setEpisodeLike = async (episodeId: number) => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
            mutation {
              setEpisodeLike(input: { episodeId: ${episodeId} }) {
             
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

  // 좋아요 등록
  await setEpisodeLike(initialEpisode.id);

  // 좋아요 등록 후 확인
  const episodeAfterFirstLike = await episodesRepository.findOne({
    where: { id: initialEpisode.id },
  });

  const likesCountAfterFirstLike = episodeAfterFirstLike.likes.length;

  expect(likesCountAfterFirstLike).toBe(1);

  // 좋아요 취소
  await setEpisodeLike(initialEpisode.id);

  // 좋아요 취소 후 확인
  const episodeAfterSecondLike = await episodesRepository.findOne({
    where: { id: initialEpisode.id },
  });

  const likesCountAfterSecondLike = episodeAfterSecondLike.likes.length;

  expect(likesCountAfterSecondLike).toBe(0);
});

test('회차 관심 있어요를 누른다. 다시 한번 누르면 관심이 취소된다.', async () => {
  const [initialEpisode] = await episodesRepository.find();

  const setEpisodeInterest = async (episodeId: number) => {
    await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: /* GraphQL */ `
          mutation {
            setEpisodeInterest(input: { episodeId: ${episodeId} }) {
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

  // 관심 등록
  await setEpisodeInterest(initialEpisode.id);

  // 관심 등록 후 확인
  const interestedEpisode = await episodesRepository.findOne({
    where: { id: initialEpisode.id },
  });
  const interestsAfterInterest = interestedEpisode.interests.length;
  expect(interestsAfterInterest).toBe(1);

  // 관심 취소
  await setEpisodeInterest(initialEpisode.id);

  // 관심 취소 후 확인
  const disinterestedEpisode = await episodesRepository.findOne({
    where: { id: initialEpisode.id },
  });
  const interestsAfterDisinterest = disinterestedEpisode.interests.length;

  expect(interestsAfterDisinterest).toBe(0);
});
