import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Like } from '../entities/like.entity';

@InputType()
export class ToggleLikeInput extends PickType(Like, [
  'likeableId',
  'likeableType',
]) {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class ToggleLikeOutput extends CoreOutput {}
