import { Module } from '@nestjs/common';
import { SagasResolver } from './sagas.resolver';
import { SagasService } from './sagas.service';
import { EpisodesResolver } from './episodes/episodes.resolver';
import { EpisodesModule } from './episodes/episodes.module';
import { Saga } from './entities/saga.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Saga, User]), EpisodesModule],
  providers: [SagasResolver, SagasService, EpisodesResolver],
})
export class SagasModule {}
