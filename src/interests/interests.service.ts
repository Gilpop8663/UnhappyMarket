import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest, InterestableType } from './entities/interest.entity';
import { User } from 'src/users/entities/user.entity';
import {
  ToggleInterestInput,
  ToggleInterestOutput,
} from './dtos/toggle-interest.dto';
import {
  InterestSagaInput,
  InterestSagaOutput,
} from './dtos/interest-saga.dto';
import { logErrorAndReturnFalse } from 'src/utils';
import {
  InterestEpisodeInput,
  InterestEpisodeOutput,
} from './dtos/interest-episode.dto';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private readonly interestsRepository: Repository<Interest>,
  ) {}

  private async toggleInterest({
    userId,
    interestableId,
    interestableType,
  }: ToggleInterestInput): Promise<ToggleInterestOutput> {
    const interest = await this.interestsRepository.findOne({
      where: { user: { id: userId }, interestableId, interestableType },
    });

    if (interest) {
      await this.interestsRepository.delete(interest.id);
      return { ok: true };
    }

    const newInterest = this.interestsRepository.create({
      user: { id: userId } as User,
      interestableId,
      interestableType,
    });
    await this.interestsRepository.save(newInterest);

    return { ok: true };
  }

  async interestSaga({
    userId,
    sagaId,
  }: InterestSagaInput): Promise<InterestSagaOutput> {
    try {
      return this.toggleInterest({
        userId,
        interestableId: sagaId,
        interestableType: InterestableType.SAGA,
      });
    } catch (error) {
      return logErrorAndReturnFalse(error, '시리즈 관심 작업에 실패했습니다.');
    }
  }

  async interestEpisode({
    userId,
    episodeId,
  }: InterestEpisodeInput): Promise<InterestEpisodeOutput> {
    try {
      return this.toggleInterest({
        userId,
        interestableId: episodeId,
        interestableType: InterestableType.EPISODE,
      });
    } catch (error) {
      return logErrorAndReturnFalse(error, '회차 관심 작업에 실패했습니다.');
    }
  }
}
