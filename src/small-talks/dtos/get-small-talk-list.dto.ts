import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { SmallTalk } from '../entities/small-talk.entity';

@InputType()
export class GetSmallTalkListInput {
  @Field(() => Number, { nullable: true })
  userId?: number;
}

@ObjectType()
export class GetSmallTalkListOutput extends CoreOutput {
  @Field(() => [SmallTalk], { nullable: true })
  data?: SmallTalk[];
}
