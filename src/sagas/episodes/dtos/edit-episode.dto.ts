import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';

@InputType()
export class EditEpisodeInput extends PickType(PartialType(Episode), [
  'title',
  'content',
  'authorComment',
  'point',
]) {
  @Field(() => Number)
  episodeId: number;
}

@ObjectType()
export class EditEpisodeOutput extends CoreOutput {}
