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
import { EditEpisodeInput, EditEpisodeOutput } from './dtos/edit-episode.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dtos/delete-episode.dto';

@Resolver()
export class EpisodesResolver {
  constructor(private readonly episodeService: EpisodesService) {}

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

  @Query(() => [Episode])
  getEpisodeList(@Args('sagaId') sagaId: number) {
    return this.episodeService.getEpisodeList(sagaId);
  }

  @Query(() => GetEpisodeDetailOutput)
  getEpisodeDetail(@Args('input') { episodeId }: GetEpisodeDetailInput) {
    return this.episodeService.getEpisodeDetail(episodeId);
  }
}
