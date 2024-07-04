import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Interest } from '../entities/interest.entity';

@InputType()
export class ToggleInterestInput extends PickType(Interest, [
  'interestableId',
  'interestableType',
]) {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class ToggleInterestOutput extends CoreOutput {}
