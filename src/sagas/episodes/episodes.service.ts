import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';
import { Saga } from '../entities/saga.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
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
import { GetEpisodeListInput } from './dtos/get-episode-list.dto';
import { PurchaseService } from 'src/purchase/purchase.service';
import { ViewLogsService } from 'src/view-logs/view-logs.service';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(Saga)
    private sagaRepository: Repository<Saga>,
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,
    private readonly purchaseService: PurchaseService,
    private readonly viewLogService: ViewLogsService,
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

  async getEpisodeList({ sagaId, userId }: GetEpisodeListInput) {
    try {
      const episodeList = await this.episodeRepository.find({
        where: { saga: { id: sagaId } },
        relations: ['likes', 'interests'],
      });

      const purchasedEpisodeIdList = userId
        ? await this.purchaseService.findPurchasedEpisodeList(userId)
        : [];

      const viewLogEpisodeIdList = userId
        ? await this.viewLogService.getEpisodeIdsByUserViewLogs(userId)
        : [];

      return {
        ok: true,
        data: episodeList.map((episode) => ({
          ...episode,
          isPurchased: purchasedEpisodeIdList.includes(episode.id),
          isViewed: viewLogEpisodeIdList.includes(episode.id),
        })),
      };
    } catch (error) {
      return logErrorAndReturnFalse(
        error,
        '에피소드 목록 불러오는데 실패했습니다.',
      );
    }
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

    if (userId) {
      await this.viewLogService.createEpisodeViewLog({ episodeId, userId });
    }

    const purchasedEpisodeIdList = userId
      ? await this.purchaseService.findPurchasedEpisodeList(userId)
      : [];

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
      episode: {
        ...episode,
        isPurchased: purchasedEpisodeIdList.includes(episode.id),
      },
      previousEpisode,
      nextEpisode,
    };
  }
}
