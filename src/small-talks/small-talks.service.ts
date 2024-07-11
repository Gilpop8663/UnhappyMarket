import { Injectable } from '@nestjs/common';
import { SmallTalk } from './entities/small-talk.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateSmallTalkInput,
  CreateSmallTalkOutput,
} from './dtos/create-small-talk.dto';
import {
  EditSmallTalkInput,
  EditSmallTalkOutput,
} from './dtos/edit-small-talk.dto';
import {
  DeleteSmallTalkInput,
  DeleteSmallTalkOutput,
} from './dtos/delete-small-talk.dto';
import {
  IncreaseSmallTalkViewCountInput,
  IncreaseSmallTalkViewCountOutput,
} from './dtos/increase-small-talk-view-count.dto';
import { logErrorAndReturnFalse } from 'src/utils';

@Injectable()
export class SmallTalksService {
  constructor(
    @InjectRepository(SmallTalk)
    private smallTalkRepository: Repository<SmallTalk>,
  ) {}

  async createSmallTalk({
    title,
    authorComment,
    content,
    point,
  }: CreateSmallTalkInput): Promise<CreateSmallTalkOutput> {
    try {
      const episode = this.smallTalkRepository.create({
        content,
        authorComment,
        title,
        point,
      });

      await this.smallTalkRepository.save(episode);

      return { ok: true, smallTalkId: episode.id };
    } catch (error) {
      return {
        ok: false,
        error: '회차 생성에 실패했습니다.',
        smallTalkId: null,
      };
    }
  }

  //   async editEpisode({
  //     episodeId,
  //     title,
  //     content,
  //     authorComment,
  //     point,
  //   }: EditSmallTalkInput): Promise<EditSmallTalkOutput> {
  //     try {
  //       await this.episodeRepository.update(episodeId, {
  //         title,
  //         content,
  //         authorComment,
  //         point,
  //       });

  //       return { ok: true };
  //     } catch (error) {
  //       return { ok: false, error: '회차 수정에 실패했습니다.' };
  //     }
  //   }

  //   async deleteEpisode({
  //     episodeId,
  //   }: DeleteSmallTalkInput): Promise<DeleteSmallTalkOutput> {
  //     try {
  //       await this.episodeRepository.delete(episodeId);

  //       return { ok: true };
  //     } catch (error) {
  //       return { ok: false, error: '회차 삭제에 실패했습니다.' };
  //     }
  //   }

  //   async increaseEpisodeViewCount({
  //     episodeId,
  //   }: IncreaseSmallTalkViewCountInput): Promise<IncreaseSmallTalkViewCountOutput> {
  //     try {
  //       const episode = await this.episodeRepository.findOne({
  //         where: { id: episodeId },
  //       });

  //       await this.episodeRepository.update(episodeId, {
  //         views: episode.views + 1,
  //       });
  //     } catch (error) {
  //       return logErrorAndReturnFalse(error, '조회수 증가에 실패했습니다.');
  //     }
  //   }
}
