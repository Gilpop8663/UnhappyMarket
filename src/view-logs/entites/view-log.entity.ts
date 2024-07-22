import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsEnum } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { SmallTalk } from 'src/small-talks/entities/small-talk.entity';

export enum ViewLogCategory {
  Episode = 'Episode',
  SmallTalk = 'SmallTalk',
}

registerEnumType(ViewLogCategory, { name: 'ViewLogCategory' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class ViewLog extends CoreEntity {
  @ManyToOne(() => User, (user) => user.viewLogs, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @Column()
  @Field(() => Number)
  relatedItemId: number;

  @ManyToOne(() => Episode, (episode) => episode.viewLogs, { nullable: true })
  @Field(() => Episode, { nullable: true })
  episode?: Episode;

  @ManyToOne(() => SmallTalk, (smallTalk) => smallTalk.viewLogs, {
    nullable: true,
  })
  @Field(() => SmallTalk, { nullable: true })
  smallTalk?: SmallTalk;

  @Column({ enum: ViewLogCategory, type: 'enum' })
  @Field(() => ViewLogCategory)
  @IsEnum(ViewLogCategory)
  category: ViewLogCategory;
}
