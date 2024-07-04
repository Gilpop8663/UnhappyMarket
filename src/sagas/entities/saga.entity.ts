import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsEnum, IsString, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Episode } from '../episodes/entities/episode.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Interest } from 'src/interests/entities/interest.entity';

enum SagaCategory {
  Series,
  Challenge,
}

registerEnumType(SagaCategory, { name: 'SagaCategory' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Saga extends CoreEntity {
  @Column()
  @Field(() => String)
  @Length(2, 30)
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
  @Length(0, 800)
  description: string;

  @Column({ enum: SagaCategory, type: 'enum' })
  @Field(() => SagaCategory)
  @IsEnum(SagaCategory)
  category: SagaCategory;

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.likeableId, { cascade: true })
  likes: Like[];

  @Field(() => [Interest])
  @OneToMany(() => Interest, (interest) => interest.interestableId, {
    cascade: true,
  })
  interests: Interest[];

  @Column({ default: false })
  @Field(() => Boolean)
  isCompleted: boolean;

  @Field(() => [Episode])
  @OneToMany(() => Episode, (episode) => episode.saga)
  episodes: Episode[];
}
