import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class IncreaseEpisodeViewCountInput {
  @Field(() => Number)
  episodeId: number;
}

@ObjectType()
export class IncreaseEpisodeViewCountOutput extends CoreOutput {}
