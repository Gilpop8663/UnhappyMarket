import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EpisodesService } from './episodes.service';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import { Episode } from './entities/episode.entity';
import {
  GetEpisodeDetailInput,
  GetEpisodeDetailOutput,
} from './dtos/get-episode-detail.dto';

@Resolver()
export class EpisodesResolver {
  constructor(private readonly episodeService: EpisodesService) {}

  @Mutation(() => CreateEpisodeOutput)
  createEpisode(@Args('input') createEpisodeInput: CreateEpisodeInput) {
    return this.episodeService.createEpisode(createEpisodeInput);
  }

  @Query(() => [Episode])
  getEpisodeList(@Args('sagaId') sagaId: number) {
    return this.episodeService.getEpisodeList(sagaId);
  }

  @Query(() => GetEpisodeDetailOutput)
  getEpisodeDetail(@Args('input') { episodeId }: GetEpisodeDetailInput) {
    return this.episodeService.getEpisodeDetail(episodeId);
  }
}
