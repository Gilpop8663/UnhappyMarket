import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommentReply } from './comment-reply.entity';
import { CommentCore } from './comment-core.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Video } from './video.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CommentCore {
  @Field(() => [CommentReply])
  @OneToMany(() => CommentReply, (reply) => reply.comment)
  replies: CommentReply[];

  @Field(() => Video)
  @ManyToOne(() => Video, (video) => video.comments, { onDelete: 'CASCADE' })
  video: Video;
}
