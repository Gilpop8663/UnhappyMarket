import { Injectable } from '@nestjs/common';
import { Purchase, PurchaseCategory } from './entities/purchase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePurchaseInput,
  CreatePurchaseOutput,
} from './dtos/create-purchase.dto';

import { logErrorAndReturnFalse } from 'src/utils';
import { User } from 'src/users/entities/user.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { SmallTalk } from 'src/small-talks/entities/small-talk.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(SmallTalk)
    private readonly smallTalkRepository: Repository<SmallTalk>,
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
  ) {}

  async createPurchase({
    category,
    relatedItemId,
    userId,
  }: CreatePurchaseInput): Promise<CreatePurchaseOutput> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      const episode =
        category === PurchaseCategory.Episode
          ? await this.episodeRepository.findOne({
              where: { id: relatedItemId },
            })
          : null;

      const smallTalk =
        category === PurchaseCategory.SmallTalk
          ? await this.smallTalkRepository.findOne({
              where: { id: relatedItemId },
            })
          : null;

      const pointsSpent = episode ? episode.point : smallTalk.point;

      if (user.point < pointsSpent) {
        return logErrorAndReturnFalse('', '포인트가 부족합니다.');
      }

      const newPurchase = this.purchaseRepository.create({
        user,
        episode,
        category,
        smallTalk,
        pointsSpent,
        relatedItemId,
      });

      await this.purchaseRepository.save(newPurchase);

      await this.userRepository.update(userId, {
        point: user.point - pointsSpent,
      });

      return { ok: true, purchaseId: newPurchase.id };
    } catch (error) {
      return logErrorAndReturnFalse(error, '구매에 실패했습니다.');
    }
  }
}
