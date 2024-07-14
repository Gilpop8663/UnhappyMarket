import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Purchase } from '../entities/purchase.entity';

@InputType()
export class CreatePurchaseInput extends PickType(Purchase, [
  'relatedItemId',
  'category',
]) {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class CreatePurchaseOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  purchaseId?: number;
}
