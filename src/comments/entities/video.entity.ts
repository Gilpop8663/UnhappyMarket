import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { Comment } from './comment.entity';
import { IsInt, IsString, Length } from 'class-validator';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
@Unique(['videoUrl'])
export class Video extends CoreEntity {
  @Column()
  @Field(() => String)
  @Length(8, 12)
  @IsString()
  videoUrl: string;

  @Column({ default: 0 })
  @Field(() => Number)
  @IsInt()
  likes: number;

  @Column({ default: 0 })
  @Field(() => Number)
  @IsInt()
  dislikes: number;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.video, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];
}
