import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { SmallTalk } from '../entities/small-talk.entity';

@InputType()
export class CreateSmallTalkInput extends PickType(SmallTalk, [
  'title',
  'content',
  'authorComment',
  'thumbnailUrl',
  'point',
]) {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class CreateSmallTalkOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  smallTalkId?: number;
}
