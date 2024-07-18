import * as request from 'supertest';

import {
  app,
  episodesRepository,
  purchaseRepository,
  smallTalkRepository,
  usersRepository,
} from './jest.setup';
import { IsNull, LessThan, MoreThan, Not } from 'typeorm';
import { PurchaseCategory } from 'src/purchase/entities/purchase.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';

const GRAPHQL_ENDPOINT = '/graphql';

test('에피소드를 구매한다.', async () => {
  let purchaseId: number;

  const [initialEpisode] = await episodesRepository.find({
    where: { point: MoreThan(1) },
  });

  const [initialUser] = await usersRepository.find({
    where: {
      point: MoreThan(2),
    },
  });

  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
          mutation {
            createPurchase(
              input: {
                relatedItemId: ${initialEpisode.id}
                userId: ${initialUser.id}
                category: ${PurchaseCategory.Episode}
              }
            ) {
              ok
              error
              purchaseId
            }
          }
        `,
    })
    .expect(200)
    .expect((res) => {
      const {
        body: {
          data: { createPurchase },
        },
      } = res;

      expect(createPurchase.ok).toBe(true);
      expect(createPurchase.error).toBe(null);
      expect(createPurchase.purchaseId).toEqual(expect.any(Number));

      purchaseId = createPurchase.purchaseId;
    });

  const purchase = await purchaseRepository.findOne({
    where: { id: purchaseId },
  });

  const createdAt = new Date(purchase.createdAt);
  const expiresAt = new Date(purchase.expiresAt);

  const diffInDays =
    (expiresAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  expect(purchase.category).toBe(PurchaseCategory.Episode);
  expect(purchase.pointsSpent).toBe(initialEpisode.point);
  expect(purchase.relatedItemId).toBe(initialEpisode.id);
  expect(diffInDays).toBeCloseTo(3, 1);

  const updatedUser = await usersRepository.findOne({
    where: { id: initialUser.id },
  });

  expect(updatedUser.point).toBe(initialUser.point - initialEpisode.point);
});

test('스몰톡을 구매한다.', async () => {
  let purchaseId: number;

  const [initialSmallTalk] = await smallTalkRepository.find({
    where: { point: MoreThan(1) },
  });

  const [initialUser] = await usersRepository.find({
    where: {
      point: MoreThan(2),
    },
  });

  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
          mutation {
            createPurchase(
              input: {
                relatedItemId: ${initialSmallTalk.id}
                userId: ${initialUser.id}
                category: ${PurchaseCategory.SmallTalk}
              }
            ) {
              ok
              error
              purchaseId
            }
          }
        `,
    })
    .expect(200)
    .expect((res) => {
      const {
        body: {
          data: { createPurchase },
        },
      } = res;

      expect(createPurchase.ok).toBe(true);
      expect(createPurchase.error).toBe(null);
      expect(createPurchase.purchaseId).toEqual(expect.any(Number));

      purchaseId = createPurchase.purchaseId;
    });

  const purchase = await purchaseRepository.findOne({
    where: { id: purchaseId },
  });

  const createdAt = new Date(purchase.createdAt);
  const expiresAt = new Date(purchase.expiresAt);

  const diffInDays =
    (expiresAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  expect(purchase.category).toBe(PurchaseCategory.SmallTalk);
  expect(purchase.pointsSpent).toBe(initialSmallTalk.point);
  expect(purchase.relatedItemId).toBe(initialSmallTalk.id);
  expect(diffInDays).toBeCloseTo(3, 1);

  const updatedUser = await usersRepository.findOne({
    where: { id: initialUser.id },
  });

  expect(updatedUser.point).toBe(initialUser.point - initialSmallTalk.point);
});

test('에피소드를 구매한다. 포인트가 부족하다면 구매되지 않고 에러 메세지를 반환한다.', async () => {
  const [initialEpisode] = await episodesRepository.find({
    where: { point: MoreThan(1) },
  });

  const [initialUser] = await usersRepository.find({
    where: {
      point: LessThan(1),
    },
  });

  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
            mutation {
              createPurchase(
                input: {
                  relatedItemId: ${initialEpisode.id}
                  userId: ${initialUser.id}
                  category: ${PurchaseCategory.Episode}
                }
              ) {
                ok
                error
                purchaseId
              }
            }
          `,
    })
    .expect(200)
    .expect((res) => {
      const {
        body: {
          data: { createPurchase },
        },
      } = res;

      expect(createPurchase.ok).toBe(false);
      expect(createPurchase.error).toBe('포인트가 부족합니다.');
    });
});

test('구매 기간이 유효한 회차/스몰톡은 포인트가 차감되지 않는다.', async () => {
  const [initialPurchase] = await purchaseRepository.find({
    relations: ['user', 'episode', 'smallTalk'],
  });

  const relatedItemId =
    initialPurchase.category === PurchaseCategory.Episode
      ? initialPurchase.episode.id
      : initialPurchase.smallTalk.id;

  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
          mutation {
            createPurchase(
              input: {
                relatedItemId: ${relatedItemId}
                userId: ${initialPurchase.user.id}
                category: ${initialPurchase.category}
              }
            ) {
              ok
              error
              purchaseId
            }
          }
        `,
    })
    .expect(200)
    .expect((res) => {
      const {
        body: {
          data: { createPurchase },
        },
      } = res;

      expect(createPurchase.ok).toBe(false);
      expect(createPurchase.error).toBe('유효 기간이 남아 구매할 수 없습니다.');
    });
});

test('구매한 회차/스몰톡이 만료 시간이 지나면 다시 포인트를 차감하고 구매한다.', async () => {
  const [initialPurchase] = await purchaseRepository.find({
    relations: ['user', 'episode', 'smallTalk'],
  });

  const currentDate = new Date();
  const prevDate = new Date(currentDate.setDate(currentDate.getDate() - 1));

  await purchaseRepository.update(initialPurchase.id, {
    expiresAt: prevDate,
  });

  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
          mutation {
            createPurchase(
              input: {
                relatedItemId: ${initialPurchase.episode.id}
                userId: ${initialPurchase.user.id}
                category: ${initialPurchase.category}
              }
            ) {
              ok
              error
              purchaseId
            }
          }
        `,
    })
    .expect(200)
    .expect((res) => {
      const {
        body: {
          data: { createPurchase },
        },
      } = res;

      expect(createPurchase.ok).toBe(true);
      expect(createPurchase.error).toBe(null);
    });
});

test('에피소드를 불러올 때 구매한 내역을 확인하고, 에피소드마다 구매한 정보를 준다.', async () => {
  const [initialPurchase] = await purchaseRepository.find({
    relations: ['user', 'episode', 'episode.saga', 'smallTalk'],
    where: { episode: Not(IsNull()) },
  });

  return request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
      query {
        getEpisodeList(input: { sagaId: ${initialPurchase.episode.saga.id},userId:${initialPurchase.user.id} }) {
          data {
            id
            title
            content
            authorComment
            createdAt
            updatedAt
            interests {
              id
            }
            likes {
              id
            }
            isPurchased
          }
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
          data: { getEpisodeList },
        },
      } = res;

      const purchasedEpisode: Episode = getEpisodeList.data.find(
        (episode: Episode) => episode.id === initialPurchase.episode.id,
      );

      expect(purchasedEpisode.isPurchased).toBe(true);
    });
});

test('에피소드를 상세 정보를 불러올 때 구매 여부에 대한 정보를 준다.', async () => {
  const [initialPurchase] = await purchaseRepository.find({
    relations: ['user', 'episode', 'smallTalk'],
    where: { episode: Not(IsNull()) },
  });

  return request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      query: /* GraphQL */ `
      query {
        getEpisodeDetail(input: { episodeId: ${initialPurchase.episode.id},userId:${initialPurchase.user.id} }) {
          ok
          episode {
            id
            isPurchased
            saga {
              id
              title
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
          data: { getEpisodeDetail },
        },
      } = res;
      console.log(getEpisodeDetail.episode);

      expect(getEpisodeDetail.episode.isPurchased).toBe(true);
    });
});
