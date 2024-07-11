import { Global, Module } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from './entities/interest.entity';
import { User } from 'src/users/entities/user.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { Saga } from 'src/sagas/entities/saga.entity';
import { SmallTalk } from 'src/small-talks/entities/small-talk.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Interest, User, Episode, Saga, SmallTalk]),
  ],
  providers: [InterestsService],
  exports: [InterestsService],
})
export class InterestsModule {}
