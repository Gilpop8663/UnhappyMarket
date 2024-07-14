import * as request from 'supertest';

import {
  app,
  episodesRepository,
  purchaseRepository,
  usersRepository,
} from './jest.setup';
import { MoreThan } from 'typeorm';
import { PurchaseCategory } from 'src/purchase/entities/purchase.entity';

const GRAPHQL_ENDPOINT = '/graphql';

test('에피소드를 구매한다.', async () => {
  let smallTalkId: number;

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
      expect(createPurchase.smallTalkId).toEqual(expect.any(Number));

      smallTalkId = createPurchase.smallTalkId;
    });

  const purchase = await purchaseRepository.findOne({
    where: { id: smallTalkId },
  });

  const createdAt = new Date(purchase.createdAt);
  const expiresAt = new Date(purchase.expiresAt);

  const diffInDays =
    (expiresAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  expect(purchase.category).toBe(PurchaseCategory.Episode);
  expect(purchase.pointsSpent).toBe(initialEpisode.point);
  expect(purchase.relatedItemId).toBe(initialEpisode.id);
  expect(diffInDays).toBeCloseTo(3, 1);
});
