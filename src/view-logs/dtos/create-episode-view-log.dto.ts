import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateEpisodeViewLogInput {
  @Field(() => Number)
  userId: number;

  @Field(() => Number)
  episodeId: number;
}

@ObjectType()
export class CreateEpisodeViewLogOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  viewLogId?: number;
}
