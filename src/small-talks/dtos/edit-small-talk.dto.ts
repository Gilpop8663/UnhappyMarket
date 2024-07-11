import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { SmallTalk } from '../entities/small-talk.entity';

@InputType()
export class EditSmallTalkInput extends PickType(PartialType(SmallTalk), [
  'title',
  'content',
  'authorComment',
  'point',
]) {
  @Field(() => Number)
  smallTalkId: number;
}

@ObjectType()
export class EditSmallTalkOutput extends CoreOutput {}
