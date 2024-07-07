import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class GetCommentListInput extends PickType(Comment, ['category']) {
  @Field(() => Number, { nullable: true })
  episodeId: number;
}

@ObjectType()
export class GetCommentListOutput extends CoreOutput {
  @Field(() => [Comment], { nullable: true })
  data?: Comment[];
}
