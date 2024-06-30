import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class LikeSagaInput {
  @Field(() => Number)
  userId: number;

  @Field(() => Number)
  sagaId: number;
}

@ObjectType()
export class LikeSagaOutput extends CoreOutput {}
