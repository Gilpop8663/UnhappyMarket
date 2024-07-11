import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class LikeSmallTalkInput {
  @Field(() => Number)
  userId: number;

  @Field(() => Number)
  smallTalkId: number;
}

@ObjectType()
export class LikeSmallTalkOutput extends CoreOutput {}
