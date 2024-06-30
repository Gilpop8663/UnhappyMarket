import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SagasService } from './sagas.service';
import { CreateSagaInput, CreateSagaOutput } from './dtos/create-saga.dto';
import { Saga } from './entities/saga.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { DeleteSagaInput, DeleteSagaOutput } from './dtos/delete-saga.dto';
import { EditSagaInput, EditSagaOutput } from './dtos/edit-saga.dto';

@Resolver()
export class SagasResolver {
  constructor(private readonly sagaService: SagasService) {}

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

  @Query(() => [Saga])
  getSagaList() {
    return this.sagaService.getSagaList();
  }
}
