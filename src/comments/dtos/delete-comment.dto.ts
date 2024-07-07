import { InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteCommentInput {}

@ObjectType()
export class DeleteCommentOutput extends CoreOutput {}
