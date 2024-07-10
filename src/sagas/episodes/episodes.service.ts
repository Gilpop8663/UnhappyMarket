import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';
import { Saga } from '../entities/saga.entity';
import { IsNull, LessThan, MoreThan, Repository } from 'typeorm';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import {
  GetEpisodeDetailInput,
  GetEpisodeDetailOutput,
} from './dtos/get-episode-detail.dto';
import { EditEpisodeInput, EditEpisodeOutput } from './dtos/edit-episode.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dtos/delete-episode.dto';
import { logErrorAndReturnFalse } from 'src/utils';
import {
  IncreaseEpisodeViewCountInput,
  IncreaseEpisodeViewCountOutput,
} from './dtos/increase-episode-view-count.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(Saga)
    private sagaRepository: Repository<Saga>,
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createEpisode({
    title,
    authorComment,
    content,
    point,
    sagaId,
  }: CreateEpisodeInput): Promise<CreateEpisodeOutput> {
    try {
      const saga = await this.sagaRepository.findOne({
        where: { id: sagaId },
      });

      if (!saga) {
        return {
          ok: false,
          error: '시리즈를 찾지 못했습니다',
          episodeId: null,
        };
      }

      const episode = this.episodeRepository.create({
        content,
        authorComment,
        title,
        saga,
        point,
      });

      await this.episodeRepository.save(episode);

      return { ok: true, episodeId: episode.id };
    } catch (error) {
      return {
        ok: false,
        error: '회차 생성에 실패했습니다.',
        episodeId: null,
      };
    }
  }

  async editEpisode({
    episodeId,
    title,
    content,
    authorComment,
    point,
  }: EditEpisodeInput): Promise<EditEpisodeOutput> {
    try {
      await this.episodeRepository.update(episodeId, {
        title,
        content,
        authorComment,
        point,
      });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '회차 수정에 실패했습니다.' };
    }
  }

  async deleteEpisode({
    episodeId,
  }: DeleteEpisodeInput): Promise<DeleteEpisodeOutput> {
    try {
      await this.episodeRepository.delete(episodeId);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '회차 삭제에 실패했습니다.' };
    }
  }

  async increaseEpisodeViewCount({
    episodeId,
  }: IncreaseEpisodeViewCountInput): Promise<IncreaseEpisodeViewCountOutput> {
    try {
      const episode = await this.episodeRepository.findOne({
        where: { id: episodeId },
      });

      await this.episodeRepository.update(episodeId, {
        views: episode.views + 1,
      });
    } catch (error) {
      return logErrorAndReturnFalse(error, '조회수 증가에 실패했습니다.');
    }
  }

  async getEpisodeList(sagaId: number) {
    return await this.episodeRepository.find({
      where: { saga: { id: sagaId } },
      relations: ['likes', 'interests'],
    });
  }

  async getEpisodeDetail({
    episodeId,
    userId,
  }: GetEpisodeDetailInput): Promise<GetEpisodeDetailOutput> {
    const episode = await this.episodeRepository.findOne({
      where: { id: episodeId },
      relations: ['saga', 'likes', 'interests'],
      order: { createdAt: 'ASC' },
    });

    const user = await this.userRepository.findOne({
      where: { id: userId ?? IsNull() },
    });

    const previousEpisode = await this.episodeRepository.findOne({
      where: {
        saga: { id: episode.saga.id },
        createdAt: LessThan(episode.createdAt),
        id: LessThan(episode.id),
      },
      order: { createdAt: 'DESC' },
    });

    const nextEpisode = await this.episodeRepository.findOne({
      where: {
        saga: { id: episode.saga.id },
        createdAt: MoreThan(episode.createdAt),
        id: MoreThan(episode.id),
      },
      order: { createdAt: 'ASC' },
    });

    if (episode.point === 0) {
      return {
        ok: true,
        episode,
        previousEpisode,
        nextEpisode,
      };
    }

    if (!userId) {
      return { ok: false, error: '올바른 유저 정보를 입력해주세요.' };
    }

    if (episode.point > user.point) {
      return { ok: false, error: '포인트가 부족합니다.' };
    }

    await this.userRepository.update(userId, {
      point: user.point - episode.point,
    });

    return {
      ok: true,
      episode,
      previousEpisode,
      nextEpisode,
    };
  }
}
