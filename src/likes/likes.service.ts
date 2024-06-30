// src/likes/likes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like, LikeableType } from './entities/like.entity';
import { User } from 'src/users/entities/user.entity';
import { ToggleLikeInput, ToggleLikeOutput } from './dtos/toggle-like.dto';
import { LikeSagaInput, LikeSagaOutput } from './dtos/like-saga.dto';
import { logErrorAndReturnFalse } from 'src/utils';
import { LikeEpisodeInput, LikeEpisodeOutput } from './dtos/like-episode.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
  ) {}

  private async toggleLike({
    userId,
    likeableId,
    likeableType,
  }: ToggleLikeInput): Promise<ToggleLikeOutput> {
    const like = await this.likesRepository.findOne({
      where: { user: { id: userId }, likeableId, likeableType },
    });

    if (like) {
      await this.likesRepository.delete(like.id);
      return { ok: true };
    }

    const newLike = this.likesRepository.create({
      user: { id: userId } as User,
      likeableId,
      likeableType,
    });
    await this.likesRepository.save(newLike);

    return { ok: true };
  }

  async likeSaga({ userId, sagaId }: LikeSagaInput): Promise<LikeSagaOutput> {
    try {
      return this.toggleLike({
        userId,
        likeableId: sagaId,
        likeableType: LikeableType.SAGA,
      });
    } catch (error) {
      return logErrorAndReturnFalse(
        error,
        '시리즈 좋아요 작업에 실패했습니다.',
      );
    }
  }

  async likeEpisode({
    userId,
    episodeId,
  }: LikeEpisodeInput): Promise<LikeEpisodeOutput> {
    try {
      return this.toggleLike({
        userId,
        likeableId: episodeId,
        likeableType: LikeableType.EPISODE,
      });
    } catch (error) {
      return logErrorAndReturnFalse(error, '회차 좋아요 작업에 실패했습니다.');
    }
  }
}
