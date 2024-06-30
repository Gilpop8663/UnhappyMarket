import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Saga } from '../entities/saga.entity';

@InputType()
export class EditSagaInput extends PickType(Saga, [
  'title',
  'thumbnailUrl',
  'description',
]) {
  @Field(() => Number)
  sagaId: number;
}

@ObjectType()
export class EditSagaOutput extends CoreOutput {}
