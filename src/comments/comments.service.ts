import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentInput } from './dtos/create-comment.dto';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment, CommentCategory } from './entities/comment.entity';
import { logErrorAndReturnFalse } from 'src/utils';
import {
  GetCommentListInput,
  GetCommentListOutput,
} from './dtos/get-comment-list.dto';
import { EditCommentInput } from './dtos/edit-comment.dto';
import { DeleteCommentInput } from './dtos/delete-comment.dto';
import {
  CreateCommentReplyInput,
  CreateCommentReplyOutput,
} from './dtos/create-comment-reply.dto';

export enum CommentSortingType {
  POPULAR = 'popular',
  NEWEST = 'newest',
}
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // async getRepliesByCommentId(commentId: number) {
  //   const comment = await this.commentRepository.findOne({
  //     where: { id: commentId },
  //     relations: ['replies'],
  //   });

  //   if (!comment) {
  //     return { ok: false, error: '댓글이 존재하지 않습니다.' };
  //   }

  //   return comment.replies;
  // }

  async createComment(commentData: CreateCommentInput) {
    try {
      const { category, content, episodeId, userId } = commentData;

      const episode = await this.episodeRepository.findOne({
        where: { id: episodeId },
      });

      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!episode) {
        return { ok: false, error: '회차를 찾을 수 없습니다' };
      }

      const newComment = this.commentRepository.create({
        category,
        content,
        episode,
        user,
      });

      await this.commentRepository.save(newComment);

      return { ok: true, commentId: newComment.id };
    } catch (error) {
      return { ok: false, error: '댓글 생성에 실패했습니다.' };
    }
  }

  async editComment({ content, commentId }: EditCommentInput) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
      });

      if (!comment) {
        return logErrorAndReturnFalse('', '댓글이 존재하지 않습니다.');
      }

      await this.commentRepository.update(commentId, { content });

      return { ok: true };
    } catch (error) {
      return logErrorAndReturnFalse(error, '댓글 수정에 실패했습니다.');
    }
  }

  async deleteComment({ commentId }: DeleteCommentInput) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
      });

      if (!comment) {
        return logErrorAndReturnFalse('error', '댓글이 존재하지 않습니다.');
      }

      await this.commentRepository.delete(commentId);

      return { ok: true };
    } catch (error) {
      return logErrorAndReturnFalse(error, '댓글 삭제에 실패했습니다.');
    }
  }

  async getCommentList({
    category,
    episodeId,
  }: GetCommentListInput): Promise<GetCommentListOutput> {
    try {
      if (category === CommentCategory['Episode']) {
        const commentList = await this.commentRepository.find({
          where: { category, episode: { id: episodeId } },
          relations: ['user', 'replies', 'parent', 'likes', 'dislikes'],
        });

        return { data: commentList, ok: true };
      }
    } catch (error) {
      return logErrorAndReturnFalse(error, '댓글 조회에 실패했습니다');
    }
  }

  async createCommentReply({
    commentId,
    content,
    userId,
  }: CreateCommentReplyInput): Promise<CreateCommentReplyOutput> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['episode'],
      });

      if (!comment) {
        return { ok: false, error: '댓글이 존재하지 않습니다.' };
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });

      const newCommentReply = this.commentRepository.create({
        category: comment.category,
        content,
        episode: comment.episode,
        user,
        parent: comment,
      });

      await this.commentRepository.save(newCommentReply);

      return { ok: true, commentId: newCommentReply.id };
    } catch (error) {
      return { ok: false, error: '답글 생성에 실패했습니다.' };
    }
  }

  // async editReply(replyId: number, { password, content }: EditCommentInput) {
  //   try {
  //     const reply = await this.commentReplyRepository.findOne({
  //       where: { id: replyId },
  //       select: ['password'],
  //     });

  //     if (!reply) {
  //       return { ok: false, error: '답글이 존재하지 않습니다.' };
  //     }

  //     const isPasswordCorrect = await reply.checkPassword(password);

  //     if (!isPasswordCorrect) {
  //       return { ok: false, error: '비밀번호가 맞지 않습니다.' };
  //     }

  //     await this.commentReplyRepository.update(replyId, { content });

  //     return { ok: true };
  //   } catch (error) {
  //     return { ok: false, error: '답글 수정에 실패했습니다.' };
  //   }
  // }

  // async deleteReply(replyId: number, { password }: DeleteCommentInput) {
  //   try {
  //     const reply = await this.commentReplyRepository.findOne({
  //       where: { id: replyId },
  //       select: ['password'],
  //     });

  //     if (!reply) {
  //       return { ok: false, error: '답글이 존재하지 않습니다.' };
  //     }

  //     const isPasswordCorrect = await reply.checkPassword(password);

  //     if (!isPasswordCorrect) {
  //       return { ok: false, error: '비밀번호가 맞지 않습니다.' };
  //     }

  //     await this.commentReplyRepository.delete(replyId);

  //     return { ok: true };
  //   } catch (error) {
  //     return { ok: false, error: '답글 삭제에 실패했습니다.' };
  //   }
  // }

  // async likeVideo(videoId: number, isIncrement: boolean) {
  //   try {
  //     const video = await this.videoRepository.findOne({
  //       where: { id: videoId },
  //     });

  //     if (!video) {
  //       return { ok: false, error: '비디오가 존재하지 않습니다.' };
  //     }

  //     const newLikes = isIncrement ? video.likes + 1 : video.likes - 1;

  //     if (newLikes < 0) {
  //       return { ok: false, error: '좋아요 수는 0보다 작을 수 없습니다.' };
  //     }

  //     await this.videoRepository.update(videoId, {
  //       likes: newLikes,
  //     });

  //     return { ok: true };
  //   } catch (error) {
  //     return { ok: false, error: '좋아요 상태 변경에 실패했습니다.' };
  //   }
  // }

  // async dislikeVideo(videoId: number, isIncrement: boolean) {
  //   try {
  //     const video = await this.videoRepository.findOne({
  //       where: { id: videoId },
  //     });

  //     if (!video) {
  //       return { ok: false, error: '비디오가 존재하지 않습니다.' };
  //     }

  //     const newDislikes = isIncrement ? video.dislikes + 1 : video.dislikes - 1;

  //     if (newDislikes < 0) {
  //       return { ok: false, error: '싫어요 수는 0보다 작을 수 없습니다.' };
  //     }

  //     await this.videoRepository.update(videoId, {
  //       dislikes: newDislikes,
  //     });

  //     return { ok: true };
  //   } catch (error) {
  //     return { ok: false, error: '싫어요에 실패했습니다.' };
  //   }
  // }

  // async likeComment(commentId: number, isIncrement: boolean) {
  //   try {
  //     const comment = await this.commentRepository.findOne({
  //       where: { id: commentId },
  //     });

  //     if (!comment) {
  //       return { ok: false, error: '댓글이 존재하지 않습니다.' };
  //     }

  //     const newLikes = isIncrement ? comment.likes + 1 : comment.likes - 1;

  //     if (newLikes < 0) {
  //       return { ok: false, error: '좋아요 수는 0보다 작을 수 없습니다.' };
  //     }

  //     await this.commentRepository.update(commentId, {
  //       likes: newLikes,
  //     });

  //     return { ok: true };
  //   } catch (error) {
  //     return { ok: false, error: '좋아요에 실패했습니다.' };
  //   }
  // }

  // async dislikeComment(commentId: number, isIncrement: boolean) {
  //   try {
  //     const comment = await this.commentRepository.findOne({
  //       where: { id: commentId },
  //     });

  //     if (!comment) {
  //       return { ok: false, error: '댓글이 존재하지 않습니다.' };
  //     }

  //     const newDislikes = isIncrement
  //       ? comment.dislikes + 1
  //       : comment.dislikes - 1;

  //     if (newDislikes < 0) {
  //       return { ok: false, error: '싫어요 수는 0보다 작을 수 없습니다.' };
  //     }

  //     await this.commentRepository.update(commentId, {
  //       dislikes: newDislikes,
  //     });

  //     return { ok: true };
  //   } catch (error) {
  //     return { ok: false, error: '싫어요에 실패했습니다.' };
  //   }
  // }

  // async dislikeReply(replyId: number, isIncrement: boolean) {
  //   try {
  //     const reply = await this.commentReplyRepository.findOne({
  //       where: { id: replyId },
  //     });

  //     if (!reply) {
  //       return { ok: false, error: '답글이 존재하지 않습니다.' };
  //     }

  //     const newDislikes = isIncrement ? reply.dislikes + 1 : reply.dislikes - 1;

  //     if (newDislikes < 0) {
  //       return { ok: false, error: '싫어요 수는 0보다 작을 수 없습니다.' };
  //     }

  //     await this.commentReplyRepository.update(replyId, {
  //       dislikes: newDislikes,
  //     });

  //     return { ok: true };
  //   } catch (error) {
  //     return { ok: false, error: '싫어요에 실패했습니다.' };
  //   }
  // }

  // async likeReply(replyId: number, isIncrement: boolean) {
  //   try {
  //     const reply = await this.commentReplyRepository.findOne({
  //       where: { id: replyId },
  //     });

  //     if (!reply) {
  //       return { ok: false, error: '답글이 존재하지 않습니다.' };
  //     }

  //     const newLikes = isIncrement ? reply.likes + 1 : reply.likes - 1;

  //     if (newLikes < 0) {
  //       return { ok: false, error: '좋아요 수는 0보다 작을 수 없습니다.' };
  //     }

  //     await this.commentReplyRepository.update(replyId, {
  //       likes: newLikes,
  //     });

  //     return { ok: true };
  //   } catch (error) {
  //     return { ok: false, error: '좋아요에 실패했습니다.' };
  //   }
  // }
}
