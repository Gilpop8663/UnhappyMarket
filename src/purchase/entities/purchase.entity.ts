import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { IsEnum } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { SmallTalk } from 'src/small-talks/entities/small-talk.entity';

export enum PurchaseCategory {
  Episode = 'Episode',
  SmallTalk = 'SmallTalk',
}

registerEnumType(PurchaseCategory, { name: 'PurchaseCategory' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Purchase extends CoreEntity {
  @ManyToOne(() => User, (user) => user.purchases, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @Column()
  @Field(() => Number)
  relatedItemId: number;

  @ManyToOne(() => Episode, (episode) => episode.purchases, { nullable: true })
  @Field(() => Episode, { nullable: true })
  episode?: Episode;

  @ManyToOne(() => SmallTalk, (smallTalk) => smallTalk.purchases, {
    nullable: true,
  })
  @Field(() => SmallTalk, { nullable: true })
  smallTalk?: SmallTalk;

  @Column()
  @Field(() => Number)
  pointsSpent: number;

  @Column({ enum: PurchaseCategory, type: 'enum' })
  @Field(() => PurchaseCategory)
  @IsEnum(PurchaseCategory)
  category: PurchaseCategory;

  @Column()
  @Field(() => Date)
  expiresAt: Date;

  @BeforeInsert()
  setExpiryDate() {
    const currentDate = new Date();
    this.expiresAt = new Date(currentDate.setDate(currentDate.getDate() + 3));
  }
}
