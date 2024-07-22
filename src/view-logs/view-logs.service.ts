import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { SmallTalk } from 'src/small-talks/entities/small-talk.entity';
import { User } from 'src/users/entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { ViewLog, ViewLogCategory } from './entites/view-log.entity';
import { logErrorAndReturnFalse } from 'src/utils';
import {
  CreateEpisodeViewLogInput,
  CreateEpisodeViewLogOutput,
} from './dtos/create-episode-view-log.dto';
import {
  CreateSmallTalkViewLogInput,
  CreateSmallTalkViewLogOutput,
} from './dtos/create-small-talk-view-log.dto';

@Injectable()
export class ViewLogsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(SmallTalk)
    private readonly smallTalkRepository: Repository<SmallTalk>,
    @InjectRepository(ViewLog)
    private readonly viewLogRepository: Repository<ViewLog>,
  ) {}

  async createEpisodeViewLog({
    userId,
    episodeId,
  }: CreateEpisodeViewLogInput): Promise<CreateEpisodeViewLogOutput> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      const episode = await this.episodeRepository.findOne({
        where: { id: episodeId },
      });

      const existingViewLog = await this.viewLogRepository.findOne({
        where: { user, episode },
      });

      if (existingViewLog) {
        return { ok: true, viewLogId: existingViewLog.id };
      }

      const viewLog = this.viewLogRepository.create({
        category: ViewLogCategory.Episode,
        episode,
        relatedItemId: episodeId,
        user,
      });

      await this.viewLogRepository.save(viewLog);

      return { ok: true, viewLogId: viewLog.id };
    } catch (error) {
      return logErrorAndReturnFalse(error, '조회 기록 생성에 실패했습니다.');
    }
  }

  async createSmallTalkViewLog({
    userId,
    smallTalkId,
  }: CreateSmallTalkViewLogInput): Promise<CreateSmallTalkViewLogOutput> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const smallTalk = await this.smallTalkRepository.findOne({
        where: { id: smallTalkId },
      });

      const existingViewLog = await this.viewLogRepository.findOne({
        where: { user, smallTalk },
      });

      if (existingViewLog) {
        return { ok: true, viewLogId: existingViewLog.id };
      }

      const viewLog = this.viewLogRepository.create({
        category: ViewLogCategory.Episode,
        smallTalk,
        relatedItemId: smallTalkId,
        user,
      });

      await this.viewLogRepository.save(viewLog);

      return { ok: true, viewLogId: viewLog.id };
    } catch (error) {
      return logErrorAndReturnFalse(error, '조회 기록 생성에 실패했습니다.');
    }
  }

  async getEpisodeIdsByUserViewLogs(userId: number): Promise<number[]> {
    try {
      const viewLogs = await this.viewLogRepository.find({
        where: {
          user: { id: userId },
          episode: Not(IsNull()),
        },
        relations: ['episode'],
      });

      const episodeIds = viewLogs.map((viewLog) => viewLog.episode.id);

      return episodeIds;
    } catch (error) {
      console.error('조회한 에피소드 목록을 불러오는 데 실패했습니다.');

      return [];
    }
  }

  async getSmallTalkIdsByUserViewLogs(userId: number): Promise<number[]> {
    try {
      const viewLogs = await this.viewLogRepository.find({
        where: {
          user: { id: userId },
          smallTalk: Not(IsNull()),
        },
        relations: ['smallTalk'],
      });

      const smallTalkIds = viewLogs.map((viewLog) => viewLog.smallTalk.id);

      return smallTalkIds;
    } catch (error) {
      console.error('조회한 스몰톡 목록을 불러오는 데 실패했습니다.');

      return [];
    }
  }
}
