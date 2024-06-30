import { registerEnumType } from '@nestjs/graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, TableInheritance } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';

export enum LikeableType {
  SAGA = 'saga',
  EPISODE = 'episode',
}

registerEnumType(LikeableType, {
  name: 'LikeableType',
});

@ObjectType()
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'likeableType' } })
export class Like extends CoreEntity {
  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @Column()
  @Field(() => Number)
  likeableId: number;

  @Column({ type: 'enum', enum: LikeableType })
  @Field(() => LikeableType)
  likeableType: LikeableType;

  @ManyToOne(() => Episode, (episode) => episode.likes, { nullable: true })
  @Field(() => Episode, { nullable: true })
  episode?: Episode;
}
