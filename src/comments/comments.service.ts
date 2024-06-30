import { Injectable } from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentInput } from './dtos/create-comment.dto';
import { CommentReply } from './entities/comment-reply.entity';
import { EditCommentInput } from './dtos/edit-comment.dto';
import { DeleteCommentInput } from './dtos/delete-comment.dto';

export enum CommentSortingType {
  POPULAR = 'popular',
  NEWEST = 'newest',
}
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(CommentReply)
    private commentReplyRepository: Repository<CommentReply>,
  ) {}

  // async getAllVideos() {
  //   return this.videoRepository.find({
  //     relations: ['comments'],
  //     order: { likes: 'DESC', dislikes: 'DESC' },
  //   });
  // }

  // async getVideoDetailById(videoId: number) {
  //   const video = await this.videoRepository.findOne({
  //     where: { id: videoId },
  //   });

  //   if (!video) {
  //     return { ok: false, error: '비디오가 존재하지 않습니다.' };
  //   }

  //   return video;
  // }

  // async getCommentsByVideoId(videoId: number, sortingType: CommentSortingType) {
  //   let order = {};

  //   if (sortingType === CommentSortingType.NEWEST) {
  //     order = { comments: { createdAt: { direction: 'DESC' } } };
  //   } else {
  //     order = { comments: { likes: { direction: 'DESC' } } };
  //   }

  //   const video = await this.videoRepository.findOne({
  //     where: { id: videoId },
  //     relations: ['comments', 'comments.replies'],
  //     order,
  //   });

  //   if (!video) {
  //     return { ok: false, error: '비디오가 존재하지 않습니다.' };
  //   }

  //   return video.comments;
  // }

  async getRepliesByCommentId(commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['replies'],
    });

    if (!comment) {
      return { ok: false, error: '댓글이 존재하지 않습니다.' };
    }

    return comment.replies;
  }

  // async createComment(videoId: number, commentData: CreateCommentInput) {
  //   try {
  //     const video = await this.videoRepository.findOne({
  //       where: { id: videoId },
  //     });

  //     if (!video) {
  //       return { ok: false, error: '비디오를 찾을 수 없습니다' };
  //     }

  //     const newComment = this.commentRepository.create({
  //       ...commentData,
  //       video,
  //     });

  //     await this.commentRepository.save(newComment);

  //     return { ok: true, commentId: newComment.id };
  //   } catch (error) {
  //     return { ok: false, error: '댓글 생성에 실패했습니다.' };
  //   }
  // }

  // async createVideo(videoData: CreateVideoInput) {
  //   try {
  //     const extractVideoId = (url: string) => {
  //       const pattern =
  //         /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  //       const match = url.match(pattern);
  //       return match ? match[1] : null;
  //     };

  //     const videoUrl = extractVideoId(videoData.videoUrl);

  //     if (!videoData || !videoUrl) {
  //       return { ok: false, error: '유효하지 않은 URL입니다.' };
  //     }

  //     const video = await this.videoRepository.findOne({ where: { videoUrl } });

  //     if (video) {
  //       return { ok: true, videoId: video.id };
  //     }

  //     const newVideo = this.videoRepository.create({ videoUrl });

  //     await this.videoRepository.save(newVideo);

  //     return { ok: false, videoId: newVideo.id };
  //   } catch (error) {
  //     console.error(error);
  //     return { ok: false, error: '비디오 생성에 실패했습니다.' };
  //   }
  // }

  async createReply(commentId: number, replyData: CreateCommentInput) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
      });

      if (!comment) {
        return { ok: false, error: '댓글이 존재하지 않습니다.' };
      }

      const newCommentReply = this.commentReplyRepository.create({
        ...replyData,
        comment,
      });

      await this.commentReplyRepository.save(newCommentReply);

      return { ok: true, replyId: newCommentReply.id };
    } catch (error) {
      return { ok: false, error: '답글 생성에 실패했습니다.' };
    }
  }

  async checkCommentPassword(commentId: number, password: string) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        select: ['password'],
      });

      if (!comment) {
        return { ok: false, error: '댓글이 존재하지 않습니다.' };
      }

      const isPasswordCorrect = await comment.checkPassword(password);

      if (!isPasswordCorrect) {
        return { ok: false, error: '비밀번호가 맞지 않습니다.' };
      }

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '댓글 수정에 실패했습니다.' };
    }
  }

  async checkReplyPassword(replyId: number, password: string) {
    try {
      const reply = await this.commentReplyRepository.findOne({
        where: { id: replyId },
        select: ['password'],
      });

      if (!reply) {
        return { ok: false, error: '답글이 존재하지 않습니다.' };
      }

      const isPasswordCorrect = await reply.checkPassword(password);

      if (!isPasswordCorrect) {
        return { ok: false, error: '비밀번호가 맞지 않습니다.' };
      }

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '답글 수정에 실패했습니다.' };
    }
  }

  async editComment(
    commentId: number,
    { password, content }: EditCommentInput,
  ) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        select: ['password'],
      });

      if (!comment) {
        return { ok: false, error: '댓글이 존재하지 않습니다.' };
      }

      const isPasswordCorrect = await comment.checkPassword(password);

      if (!isPasswordCorrect) {
        return { ok: false, error: '비밀번호가 맞지 않습니다.' };
      }

      await this.commentRepository.update(commentId, { content });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '댓글 수정에 실패했습니다.' };
    }
  }

  async deleteComment(commentId: number, { password }: DeleteCommentInput) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        select: ['password'],
      });

      if (!comment) {
        return { ok: false, error: '댓글이 존재하지 않습니다.' };
      }

      const isPasswordCorrect = await comment.checkPassword(password);

      if (!isPasswordCorrect) {
        return { ok: false, error: '비밀번호가 맞지 않습니다.' };
      }

      await this.commentRepository.delete(commentId);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '댓글 삭제에 실패했습니다.' };
    }
  }

  async editReply(replyId: number, { password, content }: EditCommentInput) {
    try {
      const reply = await this.commentReplyRepository.findOne({
        where: { id: replyId },
        select: ['password'],
      });

      if (!reply) {
        return { ok: false, error: '답글이 존재하지 않습니다.' };
      }

      const isPasswordCorrect = await reply.checkPassword(password);

      if (!isPasswordCorrect) {
        return { ok: false, error: '비밀번호가 맞지 않습니다.' };
      }

      await this.commentReplyRepository.update(replyId, { content });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '답글 수정에 실패했습니다.' };
    }
  }

  async deleteReply(replyId: number, { password }: DeleteCommentInput) {
    try {
      const reply = await this.commentReplyRepository.findOne({
        where: { id: replyId },
        select: ['password'],
      });

      if (!reply) {
        return { ok: false, error: '답글이 존재하지 않습니다.' };
      }

      const isPasswordCorrect = await reply.checkPassword(password);

      if (!isPasswordCorrect) {
        return { ok: false, error: '비밀번호가 맞지 않습니다.' };
      }

      await this.commentReplyRepository.delete(replyId);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '답글 삭제에 실패했습니다.' };
    }
  }

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

  async likeComment(commentId: number, isIncrement: boolean) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
      });

      if (!comment) {
        return { ok: false, error: '댓글이 존재하지 않습니다.' };
      }

      const newLikes = isIncrement ? comment.likes + 1 : comment.likes - 1;

      if (newLikes < 0) {
        return { ok: false, error: '좋아요 수는 0보다 작을 수 없습니다.' };
      }

      await this.commentRepository.update(commentId, {
        likes: newLikes,
      });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '좋아요에 실패했습니다.' };
    }
  }

  async dislikeComment(commentId: number, isIncrement: boolean) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
      });

      if (!comment) {
        return { ok: false, error: '댓글이 존재하지 않습니다.' };
      }

      const newDislikes = isIncrement
        ? comment.dislikes + 1
        : comment.dislikes - 1;

      if (newDislikes < 0) {
        return { ok: false, error: '싫어요 수는 0보다 작을 수 없습니다.' };
      }

      await this.commentRepository.update(commentId, {
        dislikes: newDislikes,
      });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '싫어요에 실패했습니다.' };
    }
  }

  async dislikeReply(replyId: number, isIncrement: boolean) {
    try {
      const reply = await this.commentReplyRepository.findOne({
        where: { id: replyId },
      });

      if (!reply) {
        return { ok: false, error: '답글이 존재하지 않습니다.' };
      }

      const newDislikes = isIncrement ? reply.dislikes + 1 : reply.dislikes - 1;

      if (newDislikes < 0) {
        return { ok: false, error: '싫어요 수는 0보다 작을 수 없습니다.' };
      }

      await this.commentReplyRepository.update(replyId, {
        dislikes: newDislikes,
      });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '싫어요에 실패했습니다.' };
    }
  }

  async likeReply(replyId: number, isIncrement: boolean) {
    try {
      const reply = await this.commentReplyRepository.findOne({
        where: { id: replyId },
      });

      if (!reply) {
        return { ok: false, error: '답글이 존재하지 않습니다.' };
      }

      const newLikes = isIncrement ? reply.likes + 1 : reply.likes - 1;

      if (newLikes < 0) {
        return { ok: false, error: '좋아요 수는 0보다 작을 수 없습니다.' };
      }

      await this.commentReplyRepository.update(replyId, {
        likes: newLikes,
      });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '좋아요에 실패했습니다.' };
    }
  }
}
