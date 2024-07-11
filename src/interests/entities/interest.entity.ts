import { InputType, registerEnumType } from '@nestjs/graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { IsEnum } from 'class-validator';
import { Saga } from 'src/sagas/entities/saga.entity';
import { SmallTalk } from 'src/small-talks/entities/small-talk.entity';

export enum InterestableType {
  Saga,
  Episode,
  SmallTalk,
}

registerEnumType(InterestableType, {
  name: 'InterestableType',
});

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Interest extends CoreEntity {
  @ManyToOne(() => User, (user) => user.interests, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @Column()
  @Field(() => Number)
  interestableId: number;

  @Column({ type: 'enum', enum: InterestableType })
  @Field(() => InterestableType)
  @IsEnum(InterestableType)
  interestableType: InterestableType;

  @ManyToOne(() => Episode, (episode) => episode.interests, { nullable: true })
  @Field(() => Episode, { nullable: true })
  episode?: Episode;

  @ManyToOne(() => Saga, (saga) => saga.interests, { nullable: true })
  @Field(() => Saga, { nullable: true })
  saga?: Saga;

  @ManyToOne(() => SmallTalk, (smallTalk) => smallTalk.interests, {
    nullable: true,
  })
  @Field(() => SmallTalk, { nullable: true })
  smallTalk?: SmallTalk;
}
