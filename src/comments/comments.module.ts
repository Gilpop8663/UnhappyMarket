import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsResolver } from './comments.resolver';
import { Comment } from './entities/comment.entity';
import { CommentReply } from './entities/comment-reply.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentReply])],
  providers: [CommentsService, CommentsResolver],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
