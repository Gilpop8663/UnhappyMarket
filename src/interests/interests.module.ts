import { Global, Module } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from './entities/interest.entity';
import { User } from 'src/users/entities/user.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { Saga } from 'src/sagas/entities/saga.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Interest, User, Episode, Saga])],
  providers: [InterestsService],
  exports: [InterestsService],
})
export class InterestsModule {}
