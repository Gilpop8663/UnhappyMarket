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
import { SmallTalk } from './entities/small-talk.entity';
import {
  GetSmallTalkDetailInput,
  GetSmallTalkDetailOutput,
} from './dtos/get-small-talk-detail.dto';
import {
  IncreaseSmallTalkViewCountInput,
  IncreaseSmallTalkViewCountOutput,
} from './dtos/increase-small-talk-view-count.dto';
import {
  InterestSmallTalkInput,
  InterestSmallTalkOutput,
} from 'src/interests/dtos/interest-small-talk.dto';
import { InterestsService } from 'src/interests/interests.service';

@Resolver()
export class SmallTalksResolver {
  constructor(
    private readonly smallTalkService: SmallTalksService,
    private readonly interestService: InterestsService,
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

  @Mutation(() => IncreaseSmallTalkViewCountOutput)
  increaseSmallTalkViewCount(
    @Args('input')
    increaseSmallTalkViewCountInput: IncreaseSmallTalkViewCountInput,
  ) {
    return this.smallTalkService.increaseSmallTalkViewCount(
      increaseSmallTalkViewCountInput,
    );
  }

  @Mutation(() => InterestSmallTalkOutput)
  setSmallTalkInterest(
    @Args('input') interestSmallTalkInput: InterestSmallTalkInput,
  ) {
    return this.interestService.interestSmallTalk(interestSmallTalkInput);
  }

  @Query(() => [SmallTalk])
  getSmallTalkList() {
    return this.smallTalkService.getSmallTalkList();
  }

  @Query(() => GetSmallTalkDetailOutput)
  getSmallTalkDetail(@Args('input') input: GetSmallTalkDetailInput) {
    return this.smallTalkService.getSmallTalkDetail(input);
  }

  //   @Mutation(() => LikeSmallTalkOutput)
  //   setSmallTalkLike(@Args('input') likeSmallTalkInput: LikeSmallTalkInput) {
  //     return this.likeService.likeSmallTalk(likeSmallTalkInput);
  //   }
}
