import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateSmallTalkViewLogInput {
  @Field(() => Number)
  userId: number;

  @Field(() => Number)
  smallTalkId: number;
}

@ObjectType()
export class CreateSmallTalkViewLogOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  viewLogId?: number;
}
