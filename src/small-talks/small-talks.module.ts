import { Module } from '@nestjs/common';
import { SmallTalksResolver } from './small-talks.resolver';
import { SmallTalksService } from './small-talks.service';
import { SmallTalk } from './entities/small-talk.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmallTalk, User])],
  providers: [SmallTalksResolver, SmallTalksService],
})
export class SmallTalksModule {}
