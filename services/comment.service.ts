import prisma from '../lib/prisma';
import type {
  Comment,
  CreateCommentInput,
  UpdateCommentInput,
  CommentWithAuthor,
  CommentWithReplies,
  PaginationParams,
  PaginatedResponse,
} from '../types';

export class CommentService {
  /**
   * Create a new comment
   */
  async create(data: CreateCommentInput): Promise<CommentWithAuthor> {
    return prisma.comment.create({
      data,
      include: {
        author: true,
      },
    });
  }

  /**
   * Create a reply to a comment
   */
  async createReply(
    parentId: string,
    data: Omit<CreateCommentInput, 'parentId'>
  ): Promise<CommentWithAuthor> {
    // Get the parent comment to ensure we use the same postId
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { postId: true },
    });

    if (!parentComment) {
      throw new Error('Parent comment not found');
    }

    return prisma.comment.create({
      data: {
        ...data,
        postId: parentComment.postId,
        parentId,
      },
      include: {
        author: true,
      },
    });
  }

  /**
   * Get comment by ID with replies
   */
  async getById(id: string): Promise<CommentWithReplies | null> {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    }) as Promise<CommentWithReplies | null>;
  }

  /**
   * Get comments for a post (top-level only)
   */
  async getByPost(
    postId: string,
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<CommentWithReplies>> {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where = {
      postId,
      parentId: null, // Only top-level comments
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: true,
          replies: {
            include: {
              author: true,
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.count({ where }),
    ]);

    return {
      data: comments as CommentWithReplies[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  /**
   * Get all comments by a user
   */
  async getByAuthor(
    authorId: string,
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<CommentWithAuthor>> {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where = { authorId };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.count({ where }),
    ]);

    return {
      data: comments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  /**
   * Update comment
   */
  async update(id: string, data: UpdateCommentInput): Promise<CommentWithAuthor> {
    return prisma.comment.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    });
  }

  /**
   * Delete comment (and all replies due to cascade)
   */
  async delete(id: string): Promise<Comment> {
    return prisma.comment.delete({
      where: { id },
    });
  }

  /**
   * Check if user is author of comment
   */
  async isAuthor(commentId: string, userId: string): Promise<boolean> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });
    return comment?.authorId === userId;
  }

  /**
   * Get comment count for a post
   */
  async countByPost(postId: string): Promise<number> {
    return prisma.comment.count({
      where: { postId },
    });
  }

  /**
   * Get reply count for a comment
   */
  async countReplies(commentId: string): Promise<number> {
    return prisma.comment.count({
      where: { parentId: commentId },
    });
  }
}

// Export singleton instance
export const commentService = new CommentService();

