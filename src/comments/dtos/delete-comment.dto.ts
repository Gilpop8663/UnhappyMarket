import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class DeleteCommentInput extends PartialType(
  PickType(Comment, ['password']),
) {}

@ObjectType()
export class DeleteCommentOutput extends CoreOutput {}
