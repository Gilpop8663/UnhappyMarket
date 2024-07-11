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
import {
  EditSmallTalkInput,
  EditSmallTalkOutput,
} from './dtos/edit-small-talk.dto';
import {
  DeleteSmallTalkInput,
  DeleteSmallTalkOutput,
} from './dtos/delete-small-talk.dto';

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

  async editSmallTalk({
    smallTalkId,
    title,
    content,
    authorComment,
    thumbnailUrl,
    point,
  }: EditSmallTalkInput): Promise<EditSmallTalkOutput> {
    try {
      await this.smallTalkRepository.update(smallTalkId, {
        title,
        content,
        authorComment,
        thumbnailUrl,
        point,
      });

      return { ok: true };
    } catch (error) {
      return logErrorAndReturnFalse(error, '회차 수정에 실패했습니다.');
    }
  }

  async deleteSmallTalk({
    smallTalkId,
  }: DeleteSmallTalkInput): Promise<DeleteSmallTalkOutput> {
    try {
      await this.smallTalkRepository.delete(smallTalkId);

      return { ok: true };
    } catch (error) {
      return logErrorAndReturnFalse(error, '회차 삭제에 실패했습니다.');
    }
  }

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
