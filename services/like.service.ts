import prisma from '../lib/prisma';
import type {
  Like,
  CreateLikeInput,
  LikeWithUser,
  PaginationParams,
  PaginatedResponse,
} from '../types';

export class LikeService {
  /**
   * Like a post (create like)
   */
  async create(data: CreateLikeInput): Promise<Like> {
    return prisma.like.create({
      data,
    });
  }

  /**
   * Unlike a post (delete like)
   */
  async delete(userId: string, postId: string): Promise<Like> {
    return prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }

  /**
   * Toggle like (like if not liked, unlike if liked)
   */
  async toggle(userId: string, postId: string): Promise<{ liked: boolean; like?: Like }> {
    const existingLike = await this.getByUserAndPost(userId, postId);

    if (existingLike) {
      await this.delete(userId, postId);
      return { liked: false };
    }

    const like = await this.create({ userId, postId });
    return { liked: true, like };
  }

  /**
   * Check if user has liked a post
   */
  async hasLiked(userId: string, postId: string): Promise<boolean> {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      select: { id: true },
    });
    return !!like;
  }

  /**
   * Get like by user and post
   */
  async getByUserAndPost(userId: string, postId: string): Promise<Like | null> {
    return prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }

  /**
   * Get all likes for a post
   */
  async getByPost(
    postId: string,
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<LikeWithUser>> {
    const { page = 1, limit = 50 } = params;
    const skip = (page - 1) * limit;

    const where = { postId };

    const [likes, total] = await Promise.all([
      prisma.like.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.like.count({ where }),
    ]);

    return {
      data: likes,
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
   * Get all posts liked by a user
   */
  async getByUser(
    userId: string,
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<Like & { post: { id: string; title: string } }>> {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where = { userId };

    const [likes, total] = await Promise.all([
      prisma.like.findMany({
        where,
        skip,
        take: limit,
        include: {
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.like.count({ where }),
    ]);

    return {
      data: likes,
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
   * Get like count for a post
   */
  async countByPost(postId: string): Promise<number> {
    return prisma.like.count({
      where: { postId },
    });
  }

  /**
   * Get like count for multiple posts (batch)
   */
  async countByPosts(postIds: string[]): Promise<Map<string, number>> {
    const counts = await prisma.like.groupBy({
      by: ['postId'],
      where: {
        postId: { in: postIds },
      },
      _count: {
        postId: true,
      },
    });

    const countMap = new Map<string, number>();
    postIds.forEach((id) => countMap.set(id, 0));
    counts.forEach((c) => countMap.set(c.postId, c._count.postId));

    return countMap;
  }

  /**
   * Check if user has liked multiple posts (batch)
   */
  async hasLikedPosts(
    userId: string,
    postIds: string[]
  ): Promise<Map<string, boolean>> {
    const likes = await prisma.like.findMany({
      where: {
        userId,
        postId: { in: postIds },
      },
      select: { postId: true },
    });

    const likeMap = new Map<string, boolean>();
    postIds.forEach((id) => likeMap.set(id, false));
    likes.forEach((l) => likeMap.set(l.postId, true));

    return likeMap;
  }
}

// Export singleton instance
export const likeService = new LikeService();

