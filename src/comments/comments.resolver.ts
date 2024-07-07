import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dtos/create-comment.dto';
import {
  GetCommentListInput,
  GetCommentListOutput,
} from './dtos/get-comment-list.dto';
import { EditCommentInput, EditCommentOutput } from './dtos/edit-comment.dto';
import {
  DeleteCommentInput,
  DeleteCommentOutput,
} from './dtos/delete-comment.dto';
import {
  LikeCommentInput,
  LikeCommentOutput,
} from 'src/likes/dtos/like-comemnt.dto';
import { LikesService } from 'src/likes/likes.service';
import {
  CreateCommentReplyInput,
  CreateCommentReplyOutput,
} from './dtos/create-comment-reply.dto';

@Resolver()
export class CommentsResolver {
  constructor(
    private readonly commentService: CommentsService,
    private readonly likeService: LikesService,
  ) {}

  @Mutation(() => CreateCommentOutput)
  createComment(@Args('input') createCommentInput: CreateCommentInput) {
    return this.commentService.createComment(createCommentInput);
  }

  @Mutation(() => EditCommentOutput)
  editComment(@Args('input') input: EditCommentInput) {
    return this.commentService.editComment(input);
  }

  @Mutation(() => DeleteCommentOutput)
  deleteComment(@Args('input') input: DeleteCommentInput) {
    return this.commentService.deleteComment(input);
  }

  @Mutation(() => LikeCommentOutput)
  setCommentLike(@Args('input') input: LikeCommentInput) {
    return this.likeService.likeComment(input);
  }

  @Mutation(() => LikeCommentOutput)
  setCommentDislike(@Args('input') input: LikeCommentInput) {
    return this.likeService.dislikeComment(input);
  }

  @Mutation(() => CreateCommentReplyOutput)
  createCommentReply(@Args('input') input: CreateCommentReplyInput) {
    return this.commentService.createCommentReply(input);
  }

  @Query(() => GetCommentListOutput)
  getCommentList(@Args('input') input: GetCommentListInput) {
    return this.commentService.getCommentList(input);
  }

  @Query(() => CoreOutput)
  healthCheck() {
    console.log('health-check 잘 작동하는 중');
    return { ok: true };
  }
}
