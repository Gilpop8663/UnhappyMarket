import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';

@InputType()
export class GetEpisodeListInput {
  @Field(() => Number)
  sagaId: number;

  @Field(() => Number, { nullable: true })
  userId?: number;
}

@ObjectType()
export class GetEpisodeListOutput extends CoreOutput {
  @Field(() => [Episode], { nullable: true })
  data?: Episode[];
}
