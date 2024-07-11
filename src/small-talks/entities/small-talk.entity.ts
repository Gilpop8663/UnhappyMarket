import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class SmallTalk extends OmitType(Episode, ['saga']) {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @Column()
  @Field(() => String)
  @IsString()
  thumbnailUrl: string;
}
