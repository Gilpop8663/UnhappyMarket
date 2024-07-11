import { Module } from '@nestjs/common';
import { SmallTalksResolver } from './small-talks.resolver';
import { SmallTalksService } from './small-talks.service';
import { SmallTalk } from './entities/small-talk.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SmallTalk])],
  providers: [SmallTalksResolver, SmallTalksService],
})
export class SmallTalksModule {}
