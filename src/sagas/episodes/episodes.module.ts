import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';
import { Saga } from '../entities/saga.entity';
import { EpisodesResolver } from './episodes.resolver';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Saga, Episode, User])],
  providers: [EpisodesService, EpisodesResolver],
  exports: [EpisodesService],
})
export class EpisodesModule {}
