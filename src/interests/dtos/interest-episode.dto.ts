import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class InterestEpisodeInput {
  @Field(() => Number)
  userId: number;

  @Field(() => Number)
  episodeId: number;
}

@ObjectType()
export class InterestEpisodeOutput extends CoreOutput {}
