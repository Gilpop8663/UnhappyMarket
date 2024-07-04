import { registerEnumType } from '@nestjs/graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, TableInheritance } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';

export enum InterestableType {
  SAGA = 'saga',
  EPISODE = 'episode',
}

registerEnumType(InterestableType, {
  name: 'InterestableType',
});

@ObjectType()
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'interestableType' } })
export class Interest extends CoreEntity {
  @ManyToOne(() => User, (user) => user.interests, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @Column()
  @Field(() => Number)
  interestableId: number;

  @Column({ type: 'enum', enum: InterestableType })
  @Field(() => InterestableType)
  interestableType: InterestableType;

  @ManyToOne(() => Episode, (episode) => episode.interests, { nullable: true })
  @Field(() => Episode, { nullable: true })
  episode?: Episode;
}
