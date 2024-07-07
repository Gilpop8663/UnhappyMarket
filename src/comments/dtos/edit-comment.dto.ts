import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class EditCommentInput extends PickType(Comment, ['content']) {
  @Field(() => Number)
  commentId: number;
}

@ObjectType()
export class EditCommentOutput extends CoreOutput {}
