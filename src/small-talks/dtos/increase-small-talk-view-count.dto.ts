import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class IncreaseSmallTalkViewCountInput {
  @Field(() => Number)
  smallTalkId: number;
}

@ObjectType()
export class IncreaseSmallTalkViewCountOutput extends CoreOutput {}
