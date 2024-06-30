import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';

@InputType()
export class GetEpisodeDetailInput {
  @Field(() => Number)
  episodeId: number;
}

@ObjectType()
export class GetEpisodeDetailOutput extends CoreOutput {
  @Field(() => Episode)
  episode: Episode;
  @Field(() => Episode, { nullable: true })
  nextEpisode: Episode;
  @Field(() => Episode, { nullable: true })
  previousEpisode: Episode;
}
