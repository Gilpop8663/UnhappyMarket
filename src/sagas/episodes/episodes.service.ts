import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';
import { Saga } from '../entities/saga.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import { GetEpisodeDetailOutput } from './dtos/get-episode-detail.dto';
import { EditEpisodeInput, EditEpisodeOutput } from './dtos/edit-episode.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dtos/delete-episode.dto';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(Saga)
    private sagaRepository: Repository<Saga>,
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,
  ) {}

  async createEpisode({
    title,
    authorComment,
    content,
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
  }: EditEpisodeInput): Promise<EditEpisodeOutput> {
    try {
      await this.episodeRepository.update(episodeId, {
        title,
        content,
        authorComment,
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

  async getEpisodeList(sagaId: number) {
    return await this.episodeRepository.find({
      where: { saga: { id: sagaId } },
      relations: ['likes'],
    });
  }

  async getEpisodeDetail(episodeId: number): Promise<GetEpisodeDetailOutput> {
    const episode = await this.episodeRepository.findOne({
      where: { id: episodeId },
      relations: ['saga', 'likes'],
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

    return {
      ok: true,
      episode,
      previousEpisode,
      nextEpisode,
    };
  }
}
