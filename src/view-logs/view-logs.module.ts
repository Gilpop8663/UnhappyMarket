import { Global, Module } from '@nestjs/common';
import { ViewLogsService } from './view-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmallTalk } from 'src/small-talks/entities/small-talk.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { User } from 'src/users/entities/user.entity';
import { ViewLog } from './entites/view-log.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SmallTalk, Episode, User, ViewLog])],
  providers: [ViewLogsService],
  exports: [ViewLogsService],
})
export class ViewLogsModule {}
