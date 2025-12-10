import prisma from '../lib/prisma';
import type {
  Post,
  CreatePostInput,
  UpdatePostInput,
  PostWithAuthor,
  PostFull,
  PaginationParams,
  PaginatedResponse,
  PostFilters,
} from '../types';

export class PostService {
  /**
   * Create a new post
   */
  async create(data: CreatePostInput): Promise<PostWithAuthor> {
    return prisma.post.create({
      data,
      include: {
        author: true,
      },
    });
  }

  /**
   * Get post by ID with full details
   */
  async getById(id: string): Promise<PostFull | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: {
          where: { parentId: null }, // Only top-level comments
          include: {
            author: true,
            replies: {
              include: {
                author: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        likes: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    }) as Promise<PostFull | null>;
  }

  /**
   * Get all posts with pagination and filters
   */
  async getAll(
    params: PaginationParams = {},
    filters: PostFilters = {}
  ): Promise<PaginatedResponse<PostWithAuthor & { _count: { likes: number; comments: number } }>> {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (filters.authorId) {
      where.authorId = filters.authorId;
    }

    if (filters.published !== undefined) {
      where.published = filters.published;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      data: posts,
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
   * Get posts by author
   */
  async getByAuthor(
    authorId: string,
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<PostWithAuthor>> {
    return this.getAll(params, { authorId });
  }

  /**
   * Get published posts (feed)
   */
  async getFeed(
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<PostWithAuthor & { _count: { likes: number; comments: number } }>> {
    return this.getAll(params, { published: true });
  }

  /**
   * Update post
   */
  async update(id: string, data: UpdatePostInput): Promise<PostWithAuthor> {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    });
  }

  /**
   * Publish/unpublish post
   */
  async setPublished(id: string, published: boolean): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data: { published },
    });
  }

  /**
   * Delete post
   */
  async delete(id: string): Promise<Post> {
    return prisma.post.delete({
      where: { id },
    });
  }

  /**
   * Check if user is author of post
   */
  async isAuthor(postId: string, userId: string): Promise<boolean> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    return post?.authorId === userId;
  }

  /**
   * Get post count by author
   */
  async countByAuthor(authorId: string): Promise<number> {
    return prisma.post.count({
      where: { authorId },
    });
  }
}

// Export singleton instance
export const postService = new PostService();

