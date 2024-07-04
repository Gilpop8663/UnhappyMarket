import { Global, Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { User } from 'src/users/entities/user.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Like, User, Episode])],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
