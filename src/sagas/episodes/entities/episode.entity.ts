import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsInt, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Saga } from 'src/sagas/entities/saga.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

enum SagaCategory {
  Series,
  Challenge,
}

registerEnumType(SagaCategory, { name: 'SagaCategory' });

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

  @Column()
  @Field(() => String)
  @IsString()
  @Length(0, 300)
  authorComment: string;

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.likeableId, { cascade: true })
  likes: Like[];

  @Column({ default: 0 })
  @Field(() => Number)
  @IsInt()
  interests: number;

  // @Field(() => [Comment])
  // @OneToMany(() => Comment, (comment) => comment.post, {
  //   onDelete: 'CASCADE',
  // })
  // comments: Comment[];
}
