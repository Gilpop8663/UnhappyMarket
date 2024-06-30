import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Saga } from '../entities/saga.entity';

@InputType()
export class CreateSagaInput extends PickType(Saga, [
  'title',
  'thumbnailUrl',
  'description',
  'category',
]) {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class CreateSagaOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  sagaId: number;
}
