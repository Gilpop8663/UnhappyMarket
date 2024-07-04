import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class InterestSagaInput {
  @Field(() => Number)
  userId: number;

  @Field(() => Number)
  sagaId: number;
}

@ObjectType()
export class InterestSagaOutput extends CoreOutput {}
