// src/likes/likes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Like, LikeableType } from './entities/like.entity';
import { User } from 'src/users/entities/user.entity';
import { ToggleLikeInput, ToggleLikeOutput } from './dtos/toggle-like.dto';
import { LikeSagaInput, LikeSagaOutput } from './dtos/like-saga.dto';
import { logErrorAndReturnFalse } from 'src/utils';
import { LikeEpisodeInput, LikeEpisodeOutput } from './dtos/like-episode.dto';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { Saga } from 'src/sagas/entities/saga.entity';
import { LikeCommentInput, LikeCommentOutput } from './dtos/like-comemnt.dto';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(Saga)
    private readonly sagaRepository: Repository<Saga>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  private async toggleLike({
    userId,
    likeableId,
    likeableType,
  }: ToggleLikeInput): Promise<ToggleLikeOutput> {
    const like = await this.likesRepository.findOne({
      where: { user: { id: userId }, likeableId, likeableType },
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });

    const episode = await this.episodeRepository.findOne({
      where: { id: likeableId },
    });

    const saga = await this.sagaRepository.findOne({
      where: { id: likeableId },
    });

    const comment = await this.commentRepository.findOne({
      where: { id: likeableId },
    });

    if (like) {
      await this.likesRepository.delete(like.id);
      return { ok: true };
    }

    const newLike = this.likesRepository.create({
      user,
      likeableId,
      likeableType,
      episode: likeableType === LikeableType['Episode'] ? episode : null,
      saga: likeableType === LikeableType['Saga'] ? saga : null,
      comment: likeableType === LikeableType['Comment'] ? comment : null,
    });

    await this.likesRepository.save(newLike);

    return { ok: true };
  }

  async likeSaga({ userId, sagaId }: LikeSagaInput): Promise<LikeSagaOutput> {
    try {
      return this.toggleLike({
        userId,
        likeableId: sagaId,
        likeableType: LikeableType.Saga,
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
        likeableType: LikeableType.Episode,
      });
    } catch (error) {
      return logErrorAndReturnFalse(error, '회차 좋아요 작업에 실패했습니다.');
    }
  }

  async likeComment({
    userId,
    commentId,
  }: LikeCommentInput): Promise<LikeCommentOutput> {
    try {
      return this.toggleLike({
        userId,
        likeableId: commentId,
        likeableType: LikeableType.Comment,
      });
    } catch (error) {
      return logErrorAndReturnFalse(error, '댓글 좋아요 작업에 실패했습니다.');
    }
  }
}
