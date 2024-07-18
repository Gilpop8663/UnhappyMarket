import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Comment } from 'src/comments/entities/comment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Interest } from 'src/interests/entities/interest.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Saga } from 'src/sagas/entities/saga.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Episode extends CoreEntity {
  @Column()
  @Field(() => String)
  @Length(2, 40)
  @IsString()
  title: string;

  @Field(() => Saga)
  @ManyToOne(() => Saga, (saga) => saga.id)
  saga: Saga;

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
  @OneToMany(() => Like, (like) => like.episode, { cascade: true })
  likes: Like[];

  @Field(() => [Interest])
  @OneToMany(() => Interest, (interest) => interest.episode, { cascade: true })
  interests: Interest[];

  @Column({ default: 0 })
  @Field(() => Number)
  views: number;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.episode, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @Field(() => [Purchase])
  @OneToMany(() => Purchase, (purchase) => purchase.episode, {
    onDelete: 'CASCADE',
  })
  purchases: Purchase[];

  @Field(() => Boolean, { nullable: true })
  isPurchased?: boolean;
}
