import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EpisodesService } from './episodes.service';
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
import { LikesService } from 'src/likes/likes.service';
import {
  LikeEpisodeInput,
  LikeEpisodeOutput,
} from 'src/likes/dtos/like-episode.dto';
import {
  InterestEpisodeInput,
  InterestEpisodeOutput,
} from 'src/interests/dtos/interest-episode.dto';
import { InterestsService } from 'src/interests/interests.service';
import {
  IncreaseEpisodeViewCountInput,
  IncreaseEpisodeViewCountOutput,
} from './dtos/increase-episode-view-count.dto';
import {
  GetEpisodeListInput,
  GetEpisodeListOutput,
} from './dtos/get-episode-list.dto';

@Resolver()
export class EpisodesResolver {
  constructor(
    private readonly episodeService: EpisodesService,
    private readonly likeService: LikesService,
    private readonly interestService: InterestsService,
  ) {}

  @Mutation(() => CreateEpisodeOutput)
  createEpisode(@Args('input') createEpisodeInput: CreateEpisodeInput) {
    return this.episodeService.createEpisode(createEpisodeInput);
  }

  @Mutation(() => EditEpisodeOutput)
  editEpisode(@Args('input') editEpisodeInput: EditEpisodeInput) {
    return this.episodeService.editEpisode(editEpisodeInput);
  }

  @Mutation(() => DeleteEpisodeOutput)
  deleteEpisode(@Args('input') deleteEpisodeInput: DeleteEpisodeInput) {
    return this.episodeService.deleteEpisode(deleteEpisodeInput);
  }

  @Mutation(() => LikeEpisodeOutput)
  setEpisodeLike(@Args('input') likeEpisodeInput: LikeEpisodeInput) {
    return this.likeService.likeEpisode(likeEpisodeInput);
  }

  @Mutation(() => InterestEpisodeOutput)
  setEpisodeInterest(
    @Args('input') interestEpisodeInput: InterestEpisodeInput,
  ) {
    return this.interestService.interestEpisode(interestEpisodeInput);
  }

  @Mutation(() => IncreaseEpisodeViewCountOutput)
  increaseEpisodeViewCount(
    @Args('input') increaseEpisodeViewCountInput: IncreaseEpisodeViewCountInput,
  ) {
    return this.episodeService.increaseEpisodeViewCount(
      increaseEpisodeViewCountInput,
    );
  }

  @Query(() => GetEpisodeListOutput)
  getEpisodeList(@Args('input') input: GetEpisodeListInput) {
    return this.episodeService.getEpisodeList(input);
  }

  @Query(() => GetEpisodeDetailOutput)
  getEpisodeDetail(@Args('input') input: GetEpisodeDetailInput) {
    return this.episodeService.getEpisodeDetail(input);
  }
}
