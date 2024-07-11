import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Saga } from 'src/sagas/entities/saga.entity';

@InputType()
export class CompleteSagaInput extends PickType(Saga, ['isCompleted']) {
  @Field(() => Number)
  sagaId: number;
}

@ObjectType()
export class CompleteSagaOutput extends CoreOutput {}
