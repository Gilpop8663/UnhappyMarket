import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Dislike } from '../entities/dislike.entity';

@InputType()
export class ToggleDislikeInput extends PickType(Dislike, ['likeableId']) {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class ToggleDislikeOutput extends CoreOutput {}
