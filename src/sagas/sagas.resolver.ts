import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SagasService } from './sagas.service';
import { CreateSagaInput, CreateSagaOutput } from './dtos/create-saga.dto';
import { Saga } from './entities/saga.entity';
import { DeleteSagaInput, DeleteSagaOutput } from './dtos/delete-saga.dto';
import { EditSagaInput, EditSagaOutput } from './dtos/edit-saga.dto';
import { LikesService } from 'src/likes/likes.service';
import { InterestsService } from 'src/interests/interests.service';
import {
  InterestSagaInput,
  InterestSagaOutput,
} from 'src/interests/dtos/interest-saga.dto';
import { LikeSagaInput, LikeSagaOutput } from 'src/likes/dtos/like-saga.dto';

@Resolver()
export class SagasResolver {
  constructor(
    private readonly sagaService: SagasService,
    private readonly likeService: LikesService,
    private readonly interestService: InterestsService,
  ) {}

  @Mutation(() => CreateSagaOutput)
  createSaga(@Args('input') createSagaInput: CreateSagaInput) {
    return this.sagaService.createSaga(createSagaInput);
  }

  @Mutation(() => DeleteSagaOutput)
  deleteSaga(@Args('input') deleteSagaInput: DeleteSagaInput) {
    return this.sagaService.deleteSaga(deleteSagaInput);
  }

  @Mutation(() => EditSagaOutput)
  editSaga(@Args('input') editSagaInput: EditSagaInput) {
    return this.sagaService.editSaga(editSagaInput);
  }

  @Mutation(() => LikeSagaOutput)
  setSagaLike(@Args('input') likeSagaInput: LikeSagaInput) {
    return this.likeService.likeSaga(likeSagaInput);
  }

  @Mutation(() => InterestSagaOutput)
  setSagaInterest(@Args('input') interestSagaInput: InterestSagaInput) {
    return this.interestService.interestSaga(interestSagaInput);
  }

  @Query(() => [Saga])
  getSagaList() {
    return this.sagaService.getSagaList();
  }
}
