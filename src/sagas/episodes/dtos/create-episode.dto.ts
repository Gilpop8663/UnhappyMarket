import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';

@InputType()
export class CreateEpisodeInput extends PickType(Episode, [
  'title',
  'content',
  'authorComment',
  'point',
]) {
  @Field(() => Number)
  sagaId: number;
}

@ObjectType()
export class CreateEpisodeOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  episodeId: number;
}
