import { Entity, ManyToOne } from 'typeorm';
import { Comment } from './comment.entity';
import { CommentCore } from './comment-core.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class CommentReply extends CommentCore {
  @Field(() => Comment)
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: 'CASCADE',
  })
  comment: Comment;
}
