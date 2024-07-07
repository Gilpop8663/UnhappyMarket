import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class LikeCommentInput {
  @Field(() => Number)
  userId: number;

  @Field(() => Number)
  commentId: number;
}

@ObjectType()
export class LikeCommentOutput extends CoreOutput {}
