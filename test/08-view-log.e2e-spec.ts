import * as request from 'supertest';
import { app, episodesRepository, usersRepository } from './jest.setup';
import { GetEpisodeListOutput } from 'src/sagas/episodes/dtos/get-episode-list.dto';
import { GetSmallTalkListOutput } from 'src/small-talks/dtos/get-small-talk-list.dto';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { SmallTalk } from 'src/small-talks/entities/small-talk.entity';

const GRAPHQL_ENDPOINT = '/graphql';

const getEpisodeListFn = async (sagaId: number, userId: number) => {
  const res = await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
          query {
            getEpisodeList(input: { sagaId: ${sagaId} ,userId:${userId}}) {
              data {
                id
                views
                isViewed
              }
              ok
              error
            }
          }
        `,
    });

  const {
    body: {
      data: { getEpisodeList },
    },
  } = res;

  return getEpisodeList;
};

const getEpisodeDetail = async (episodeId: number, userId: number) => {
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
                views
                isPurchased
              }
      
            }
          }
        `,
    });
};

const getSmallTalkListFn = async (userId: number) => {
  const res = await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
      query {
        getSmallTalkList(input: {userId: ${userId}}) {
          ok
          error
          data {
            id
            isViewed
            views
          
          }
        }
      }
    `,
    });

  const {
    body: {
      data: { getSmallTalkList },
    },
  } = res;

  return getSmallTalkList;
};

const getSmallTalkDetail = async (smallTalkId: number, userId: number) => {
  const res = await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
      query {
        getSmallTalkDetail(input: { smallTalkId: ${smallTalkId}, userId: ${userId} }) {
          ok
          error
          data {
            id
            views
          }
        }
      }
    `,
    });

  const {
    body: {
      data: { getSmallTalkDetail },
    },
  } = res;

  return getSmallTalkDetail;
};

test('에피소드 상세 보기를 하면 해당 에피소드를 조회했던 것을 기억한다.', async () => {
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

  const updatedEpisodeList = await getEpisodeListFn(
    initialEpisode.saga.id,
    initialUser.id,
  );

  const updatedEpisode = updatedEpisodeList.data.find(
    (episode) => episode.id === notViewedEpisode.id,
  );

  expect(updatedEpisode.isViewed).toBe(true);
});

test('스몰톡 상세 보기를 하면 해당 스몰톡을 조회했던 것을 기억한다.', async () => {
  const [initialUser] = await usersRepository.find();

  const smallTalkList: GetSmallTalkListOutput = await getSmallTalkListFn(
    initialUser.id,
  );

  const notViewedSmallTalk = smallTalkList.data.find(
    (smallTalk) => smallTalk.isViewed === false,
  );

  await getSmallTalkDetail(notViewedSmallTalk.id, initialUser.id);

  const updatedSmallTalkList = await getSmallTalkListFn(initialUser.id);

  const updatedSmallTalk = updatedSmallTalkList.data.find(
    (smallTalk) => smallTalk.id === notViewedSmallTalk.id,
  );

  expect(updatedSmallTalk.isViewed).toBe(true);
});

test('에피소드 상세 보기를 하면 해당 에피소드 조회수가 1 오른다.', async () => {
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

  const updatedEpisodeList = await getEpisodeListFn(
    initialEpisode.saga.id,
    initialUser.id,
  );

  const updatedEpisode: Episode = updatedEpisodeList.data.find(
    (episode) => episode.id === notViewedEpisode.id,
  );

  expect(updatedEpisode.views).toBe(notViewedEpisode.views + 1);
});

test('스몰톡 상세 보기를 하면 해당 스몰톡의 조회수가 1 오른다.', async () => {
  const [initialUser] = await usersRepository.find();

  const smallTalkList: GetSmallTalkListOutput = await getSmallTalkListFn(
    initialUser.id,
  );

  const notViewedSmallTalk = smallTalkList.data.find(
    (smallTalk) => smallTalk.isViewed === false,
  );

  await getSmallTalkDetail(notViewedSmallTalk.id, initialUser.id);

  const updatedSmallTalkList = await getSmallTalkListFn(initialUser.id);

  const updatedSmallTalk: SmallTalk = updatedSmallTalkList.data.find(
    (smallTalk) => smallTalk.id === notViewedSmallTalk.id,
  );

  expect(updatedSmallTalk.views).toBe(notViewedSmallTalk.views + 1);
});
