import { Injectable } from '@nestjs/common';
import { SmallTalk } from './entities/small-talk.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateSmallTalkInput,
  CreateSmallTalkOutput,
} from './dtos/create-small-talk.dto';
import { logErrorAndReturnFalse } from 'src/utils';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SmallTalksService {
  constructor(
    @InjectRepository(SmallTalk)
    private smallTalkRepository: Repository<SmallTalk>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createSmallTalk({
    title,
    authorComment,
    content,
    point,
    thumbnailUrl,
    userId,
  }: CreateSmallTalkInput): Promise<CreateSmallTalkOutput> {
    try {
      const author = await this.userRepository.findOne({
        where: { id: userId },
      });

      const smallTalk = this.smallTalkRepository.create({
        content,
        authorComment,
        title,
        point,
        thumbnailUrl,
        author,
      });

      await this.smallTalkRepository.save(smallTalk);

      return { ok: true, smallTalkId: smallTalk.id };
    } catch (error) {
      return logErrorAndReturnFalse(error, '스몰톡 생성에 실패했습니다.');
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
