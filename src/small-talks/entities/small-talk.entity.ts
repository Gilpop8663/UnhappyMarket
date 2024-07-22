import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Comment } from 'src/comments/entities/comment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Interest } from 'src/interests/entities/interest.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { User } from 'src/users/entities/user.entity';
import { ViewLog } from 'src/view-logs/entites/view-log.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class SmallTalk extends CoreEntity {
  @Column()
  @Field(() => String)
  @Length(2, 40)
  @IsString()
  title: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @Column()
  @Field(() => String)
  @IsString()
  thumbnailUrl: string;

  @Column()
  @Field(() => String)
  @IsString()
  @Length(0, 20000)
  content: string;

  @Column({ default: 0 })
  @Field(() => Number)
  point: number;

  @Column()
  @Field(() => String)
  @IsString()
  @Length(0, 300)
  authorComment: string;

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.smallTalk, { cascade: true })
  likes: Like[];

  @Field(() => [Interest])
  @OneToMany(() => Interest, (interest) => interest.smallTalk, {
    cascade: true,
  })
  interests: Interest[];

  @Field(() => Number)
  views: number;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.smallTalk, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @Field(() => [Purchase])
  @OneToMany(() => Purchase, (purchase) => purchase.smallTalk, {
    onDelete: 'CASCADE',
  })
  purchases: Purchase[];

  @Field(() => [ViewLog])
  @OneToMany(() => ViewLog, (viewLog) => viewLog.smallTalk, {
    onDelete: 'CASCADE',
  })
  viewLogs: ViewLog[];

  @Field(() => Boolean, { nullable: true })
  isPurchased?: boolean;

  @Field(() => Boolean, { nullable: true })
  isViewed?: boolean;
}
