import { Global, Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { User } from 'src/users/entities/user.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { Saga } from 'src/sagas/entities/saga.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Dislike } from './entities/dislike.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Like, User, Episode, Saga, Comment, Dislike]),
  ],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
