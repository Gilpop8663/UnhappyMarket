import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SmallTalksService } from './small-talks.service';
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
  GetSmallTalkDetailInput,
  GetSmallTalkDetailOutput,
} from './dtos/get-small-talk-detail.dto';
import {
  InterestSmallTalkInput,
  InterestSmallTalkOutput,
} from 'src/interests/dtos/interest-small-talk.dto';
import { InterestsService } from 'src/interests/interests.service';
import {
  LikeSmallTalkInput,
  LikeSmallTalkOutput,
} from 'src/likes/dtos/like-small-talk.dto';
import { LikesService } from 'src/likes/likes.service';
import {
  GetSmallTalkListInput,
  GetSmallTalkListOutput,
} from './dtos/get-small-talk-list.dto';

@Resolver()
export class SmallTalksResolver {
  constructor(
    private readonly smallTalkService: SmallTalksService,
    private readonly interestService: InterestsService,
    private readonly likeService: LikesService,
  ) {}

  @Mutation(() => CreateSmallTalkOutput)
  createSmallTalk(@Args('input') createSmallTalkInput: CreateSmallTalkInput) {
    return this.smallTalkService.createSmallTalk(createSmallTalkInput);
  }

  @Mutation(() => EditSmallTalkOutput)
  editSmallTalk(@Args('input') editSmallTalkInput: EditSmallTalkInput) {
    return this.smallTalkService.editSmallTalk(editSmallTalkInput);
  }

  @Mutation(() => DeleteSmallTalkOutput)
  deleteSmallTalk(@Args('input') deleteSmallTalkInput: DeleteSmallTalkInput) {
    return this.smallTalkService.deleteSmallTalk(deleteSmallTalkInput);
  }

  @Mutation(() => InterestSmallTalkOutput)
  setSmallTalkInterest(@Args('input') input: InterestSmallTalkInput) {
    return this.interestService.interestSmallTalk(input);
  }

  @Mutation(() => LikeSmallTalkOutput)
  setSmallTalkLike(@Args('input') input: LikeSmallTalkInput) {
    return this.likeService.likeSmallTalk(input);
  }

  @Query(() => GetSmallTalkListOutput)
  getSmallTalkList(@Args('input') input: GetSmallTalkListInput) {
    return this.smallTalkService.getSmallTalkList(input);
  }

  @Query(() => GetSmallTalkDetailOutput)
  getSmallTalkDetail(@Args('input') input: GetSmallTalkDetailInput) {
    return this.smallTalkService.getSmallTalkDetail(input);
  }
}
