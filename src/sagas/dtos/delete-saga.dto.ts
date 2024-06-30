import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteSagaInput {
  @Field(() => Number)
  sagaId: number;
}

@ObjectType()
export class DeleteSagaOutput extends CoreOutput {}
