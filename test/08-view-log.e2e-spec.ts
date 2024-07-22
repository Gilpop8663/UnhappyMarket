import * as request from 'supertest';
import { app, episodesRepository, usersRepository } from './jest.setup';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { GetEpisodeListOutput } from 'src/sagas/episodes/dtos/get-episode-list.dto';

const GRAPHQL_ENDPOINT = '/graphql';

const getEpisodeListFn = (sagaId: number, userId: number) => {
  return request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
          query {
            getEpisodeList(input: { sagaId: ${sagaId} ,userId:${userId}}) {
              data {
                id
                isViewed
              }
              ok
              error
            }
          }
        `,
    });
};

const getEpisodeDetail = (episodeId: number, userId: number) => {
  return request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
          query {
            getEpisodeDetail(input: { episodeId: ${episodeId},userId:${userId} }) {
              ok
              error
              episode {
                id
                isPurchased
              }
      
            }
          }
        `,
    });
};

test('에피소드 상세 보기를 하면 해당 에피소드를 조회했던 것을 기억한다.', async () => {
  let purchaseId: number;

  const [initialEpisode] = await episodesRepository.find({
    relations: ['saga'],
  });

  const [initialUser] = await usersRepository.find();

  const episodeList: GetEpisodeListOutput = await getEpisodeListFn(
    initialEpisode.saga.id,
    initialUser.id,
  );

  const notViewedEpisode = episodeList.data.find(
    (episode) => episode.isViewed === false,
  );

  await getEpisodeDetail(notViewedEpisode.id, initialUser.id);

  const res = await getEpisodeListFn(initialEpisode.saga.id, initialUser.id);

  const {
    body: {
      data: { getEpisodeList },
    },
  } = res;

  const updatedEpisode = getEpisodeList.data.find(
    (episode) => episode.id === notViewedEpisode.id,
  );

  expect(updatedEpisode.isViewed).toBe(true);
});
