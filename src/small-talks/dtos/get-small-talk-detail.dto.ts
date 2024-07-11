import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { SmallTalk } from '../entities/small-talk.entity';

@InputType()
export class GetSmallTalkDetailInput {
  @Field(() => Number)
  smallTalkId: number;
}

@ObjectType()
export class GetSmallTalkDetailOutput extends CoreOutput {
  @Field(() => SmallTalk, { nullable: true })
  data?: SmallTalk;
}
