import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class CreateCommentInput extends PickType(Comment, [
  'nickname',
  'password',
  'content',
]) {}

@ObjectType()
export class CreateCommentOutput extends CoreOutput {
  @Field(() => Number)
  commentId: number;
}
