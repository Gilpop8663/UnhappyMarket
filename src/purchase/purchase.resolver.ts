import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PurchaseService } from './purchase.service';
import {
  CreatePurchaseInput,
  CreatePurchaseOutput,
} from './dtos/create-purchase.dto';

@Resolver()
export class PurchaseResolver {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Mutation(() => CreatePurchaseOutput)
  createPurchase(@Args('input') input: CreatePurchaseInput) {
    return this.purchaseService.createPurchase(input);
  }
}
