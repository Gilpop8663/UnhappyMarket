import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class CreateReplyInput extends PickType(Comment, [
  'nickname',
  'password',
  'content',
]) {}

@ObjectType()
export class CreateReplyOutput extends CoreOutput {
  @Field(() => Number)
  replyId: number;
}
