import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class EditCommentInput extends PartialType(
  PickType(Comment, ['password', 'content']),
) {}

@ObjectType()
export class EditCommentOutput extends CoreOutput {}
