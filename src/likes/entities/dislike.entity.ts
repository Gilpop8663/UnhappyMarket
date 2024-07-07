import { InputType } from '@nestjs/graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Dislike extends CoreEntity {
  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @Column()
  @Field(() => Number)
  likeableId: number;

  @ManyToOne(() => Comment, (comment) => comment.likes, { nullable: true })
  @Field(() => Comment, { nullable: true })
  comment: Comment;
}
