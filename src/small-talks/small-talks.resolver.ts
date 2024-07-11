import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SmallTalksService } from './small-talks.service';
import {
  CreateSmallTalkInput,
  CreateSmallTalkOutput,
} from './dtos/create-small-talk.dto';
import {
  EditSmallTalkInput,
  EditSmallTalkOutput,
} from './dtos/edit-small-talk.dto';

@Resolver()
export class SmallTalksResolver {
  constructor(private readonly smallTalkService: SmallTalksService) {}

  @Mutation(() => CreateSmallTalkOutput)
  createSmallTalk(@Args('input') createSmallTalkInput: CreateSmallTalkInput) {
    return this.smallTalkService.createSmallTalk(createSmallTalkInput);
  }

  @Mutation(() => EditSmallTalkOutput)
  editSmallTalk(@Args('input') editSmallTalkInput: EditSmallTalkInput) {
    return this.smallTalkService.editSmallTalk(editSmallTalkInput);
  }

  //   @Mutation(() => DeleteSmallTalkOutput)
  //   deleteSmallTalk(@Args('input') deleteSmallTalkInput: DeleteSmallTalkInput) {
  //     return this.smallTalkService.deleteSmallTalk(deleteSmallTalkInput);
  //   }

  //   @Mutation(() => LikeSmallTalkOutput)
  //   setSmallTalkLike(@Args('input') likeSmallTalkInput: LikeSmallTalkInput) {
  //     return this.likeService.likeSmallTalk(likeSmallTalkInput);
  //   }

  //   @Mutation(() => InterestSmallTalkOutput)
  //   setSmallTalkInterest(
  //     @Args('input') interestSmallTalkInput: InterestSmallTalkInput,
  //   ) {
  //     return this.interestService.interestSmallTalk(interestSmallTalkInput);
  //   }

  //   @Mutation(() => IncreaseSmallTalkViewCountOutput)
  //   increaseSmallTalkViewCount(
  //     @Args('input')
  //     increaseSmallTalkViewCountInput: IncreaseSmallTalkViewCountInput,
  //   ) {
  //     return this.smallTalkService.increaseSmallTalkViewCount(
  //       increaseSmallTalkViewCountInput,
  //     );
  //   }

  //   @Query(() => [SmallTalk])
  //   getSmallTalkList(@Args('sagaId') sagaId: number) {
  //     return this.smallTalkService.getSmallTalkList(sagaId);
  //   }

  //   @Query(() => GetSmallTalkDetailOutput)
  //   getSmallTalkDetail(@Args('input') input: GetSmallTalkDetailInput) {
  //     return this.smallTalkService.getSmallTalkDetail(input);
  //   }
}
