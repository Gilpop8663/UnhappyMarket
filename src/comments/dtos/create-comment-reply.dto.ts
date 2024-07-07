import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class CreateCommentReplyInput extends PickType(Comment, ['content']) {
  @Field(() => Number)
  userId: number;

  @Field(() => Number)
  commentId: number;
}

@ObjectType()
export class CreateCommentReplyOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  commentId?: number;
}
