import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteSmallTalkInput {
  @Field(() => Number)
  smallTalkId: number;
}

@ObjectType()
export class DeleteSmallTalkOutput extends CoreOutput {}
