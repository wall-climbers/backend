/**
 * Like API Handlers
 * Use these handlers in your Next.js API routes
 * 
 * Example usage in Next.js App Router (app/api/posts/[postId]/like/route.ts):
 * 
 * import { likeHandlers } from '@/backend/api/likes';
 * 
 * export async function POST(
 *   request: Request,
 *   { params }: { params: { postId: string } }
 * ) {
 *   return likeHandlers.toggle(params.postId, request);
 * }
 */

import { likeService } from '../services';

// Helper to create JSON response
const jsonResponse = (data: unknown, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

// Helper to parse URL search params
const parseParams = (url: string) => {
  const { searchParams } = new URL(url);
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '50'),
    userId: searchParams.get('userId') || undefined,
  };
};

export const likeHandlers = {
  /**
   * POST /api/posts/[postId]/like
   * Toggle like on a post (like if not liked, unlike if liked)
   */
  async toggle(postId: string, request: Request) {
    try {
      const body = await request.json() as { userId: string };
      
      if (!body.userId) {
        return jsonResponse(
          { success: false, error: 'userId is required' },
          400
        );
      }

      const result = await likeService.toggle(body.userId, postId);
      
      return jsonResponse({
        success: true,
        data: {
          liked: result.liked,
          message: result.liked ? 'Post liked' : 'Post unliked',
        },
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      return jsonResponse(
        { success: false, error: 'Failed to toggle like' },
        500
      );
    }
  },

  /**
   * POST /api/posts/[postId]/like/add
   * Like a post (will error if already liked)
   */
  async like(postId: string, request: Request) {
    try {
      const body = await request.json() as { userId: string };
      
      if (!body.userId) {
        return jsonResponse(
          { success: false, error: 'userId is required' },
          400
        );
      }

      // Check if already liked
      const alreadyLiked = await likeService.hasLiked(body.userId, postId);
      if (alreadyLiked) {
        return jsonResponse(
          { success: false, error: 'Post already liked' },
          409
        );
      }

      const like = await likeService.create({ userId: body.userId, postId });
      
      return jsonResponse({ success: true, data: like }, 201);
    } catch (error) {
      console.error('Error liking post:', error);
      return jsonResponse(
        { success: false, error: 'Failed to like post' },
        500
      );
    }
  },

  /**
   * DELETE /api/posts/[postId]/like
   * Unlike a post
   */
  async unlike(postId: string, request: Request) {
    try {
      const body = await request.json() as { userId: string };
      
      if (!body.userId) {
        return jsonResponse(
          { success: false, error: 'userId is required' },
          400
        );
      }

      await likeService.delete(body.userId, postId);
      
      return jsonResponse({ success: true, message: 'Post unliked' });
    } catch (error) {
      console.error('Error unliking post:', error);
      return jsonResponse(
        { success: false, error: 'Failed to unlike post' },
        500
      );
    }
  },

  /**
   * GET /api/posts/[postId]/likes
   * Get all likes for a post
   */
  async getByPost(postId: string, request: Request) {
    try {
      const { page, limit } = parseParams(request.url);
      const result = await likeService.getByPost(postId, { page, limit });
      
      return jsonResponse({ success: true, ...result });
    } catch (error) {
      console.error('Error fetching likes:', error);
      return jsonResponse(
        { success: false, error: 'Failed to fetch likes' },
        500
      );
    }
  },

  /**
   * GET /api/posts/[postId]/like/status
   * Check if a user has liked a post
   */
  async checkStatus(postId: string, request: Request) {
    try {
      const { userId } = parseParams(request.url);
      
      if (!userId) {
        return jsonResponse(
          { success: false, error: 'userId query param is required' },
          400
        );
      }

      const liked = await likeService.hasLiked(userId, postId);
      const count = await likeService.countByPost(postId);
      
      return jsonResponse({
        success: true,
        data: {
          liked,
          count,
        },
      });
    } catch (error) {
      console.error('Error checking like status:', error);
      return jsonResponse(
        { success: false, error: 'Failed to check like status' },
        500
      );
    }
  },

  /**
   * GET /api/posts/[postId]/likes/count
   * Get like count for a post
   */
  async getCount(postId: string) {
    try {
      const count = await likeService.countByPost(postId);
      
      return jsonResponse({
        success: true,
        data: { count },
      });
    } catch (error) {
      console.error('Error fetching like count:', error);
      return jsonResponse(
        { success: false, error: 'Failed to fetch like count' },
        500
      );
    }
  },
};

