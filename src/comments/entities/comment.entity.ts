import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsString, MaxLength, MinLength, IsInt, IsEnum } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

export enum CommentCategory {
  Saga,
  Episode,
  Challenge = 'Challenge',
}

registerEnumType(CommentCategory, {
  name: 'CommentCategory',
  description: '댓글의 종류',
});

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CoreEntity {
  @Column()
  @Field(() => String)
  @MaxLength(5000, { message: '댓글 내용은 5000자 이내로 입력해주세요.' })
  @MinLength(1, { message: '댓글 내용은 2글자 이상으로 입력해주세요' })
  @IsString()
  content: string;

  @Column({ default: 0 })
  @Field(() => Number)
  @IsInt()
  likes: number;

  @Column({ default: 0 })
  @Field(() => Number)
  @IsInt()
  dislikes: number;

  @Column({
    type: 'enum',
    enum: CommentCategory,
    default: CommentCategory.Episode,
  })
  @Field(() => CommentCategory)
  @IsEnum(CommentCategory)
  category: CommentCategory;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => Comment, { nullable: true })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  @Field(() => [Comment], { nullable: true })
  replies: Comment[];

  @Field(() => Episode)
  @ManyToOne(() => Episode, (episode) => episode.comments)
  episode: Episode;
}
