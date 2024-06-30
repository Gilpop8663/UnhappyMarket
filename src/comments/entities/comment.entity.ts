import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommentReply } from './comment-reply.entity';
import { CommentCore } from './comment-core.entity';
import { Entity, OneToMany } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CommentCore {
  @Field(() => [CommentReply])
  @OneToMany(() => CommentReply, (reply) => reply.comment)
  replies: CommentReply[];

  // @Field(() => Post)
  // @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  // post: Post;
}
