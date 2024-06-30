import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';
import { Saga } from '../entities/saga.entity';
import { EpisodesResolver } from './episodes.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Saga, Episode])],
  providers: [EpisodesService, EpisodesResolver],
  exports: [EpisodesService],
})
export class EpisodesModule {}
