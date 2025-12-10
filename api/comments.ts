/**
 * Comment API Handlers
 * Use these handlers in your Next.js API routes
 * 
 * Example usage in Next.js App Router (app/api/posts/[postId]/comments/route.ts):
 * 
 * import { commentHandlers } from '@/backend/api/comments';
 * 
 * export async function GET(
 *   request: Request,
 *   { params }: { params: { postId: string } }
 * ) {
 *   return commentHandlers.getByPost(params.postId, request);
 * }
 */

import { commentService } from '../services';
import type { CreateCommentInput, UpdateCommentInput } from '../types';

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
    limit: parseInt(searchParams.get('limit') || '20'),
  };
};

export const commentHandlers = {
  /**
   * GET /api/posts/[postId]/comments
   * Get all comments for a post
   */
  async getByPost(postId: string, request: Request) {
    try {
      const { page, limit } = parseParams(request.url);
      const result = await commentService.getByPost(postId, { page, limit });
      
      return jsonResponse({ success: true, ...result });
    } catch (error) {
      console.error('Error fetching comments:', error);
      return jsonResponse(
        { success: false, error: 'Failed to fetch comments' },
        500
      );
    }
  },

  /**
   * GET /api/comments/[id]
   * Get a single comment by ID
   */
  async getById(id: string) {
    try {
      const comment = await commentService.getById(id);
      
      if (!comment) {
        return jsonResponse(
          { success: false, error: 'Comment not found' },
          404
        );
      }
      
      return jsonResponse({ success: true, data: comment });
    } catch (error) {
      console.error('Error fetching comment:', error);
      return jsonResponse(
        { success: false, error: 'Failed to fetch comment' },
        500
      );
    }
  },

  /**
   * POST /api/posts/[postId]/comments
   * Create a new comment on a post
   */
  async create(postId: string, request: Request) {
    try {
      const body = await request.json() as Omit<CreateCommentInput, 'postId'>;
      
      // Validation
      if (!body.content || !body.authorId) {
        return jsonResponse(
          { success: false, error: 'Content and authorId are required' },
          400
        );
      }

      const comment = await commentService.create({
        ...body,
        postId,
      });
      
      return jsonResponse({ success: true, data: comment }, 201);
    } catch (error) {
      console.error('Error creating comment:', error);
      return jsonResponse(
        { success: false, error: 'Failed to create comment' },
        500
      );
    }
  },

  /**
   * POST /api/comments/[id]/replies
   * Create a reply to a comment
   */
  async createReply(parentId: string, request: Request) {
    try {
      const body = await request.json() as { content: string; authorId: string };
      
      // Validation
      if (!body.content || !body.authorId) {
        return jsonResponse(
          { success: false, error: 'Content and authorId are required' },
          400
        );
      }

      // Get parent comment to get postId
      const parentComment = await commentService.getById(parentId);
      if (!parentComment) {
        return jsonResponse(
          { success: false, error: 'Parent comment not found' },
          404
        );
      }

      const reply = await commentService.createReply(parentId, {
        content: body.content,
        authorId: body.authorId,
        postId: parentComment.postId,
      });
      
      return jsonResponse({ success: true, data: reply }, 201);
    } catch (error) {
      console.error('Error creating reply:', error);
      return jsonResponse(
        { success: false, error: 'Failed to create reply' },
        500
      );
    }
  },

  /**
   * PUT /api/comments/[id]
   * Update a comment
   */
  async update(id: string, request: Request) {
    try {
      const body = await request.json() as UpdateCommentInput;
      
      if (!body.content) {
        return jsonResponse(
          { success: false, error: 'Content is required' },
          400
        );
      }

      const comment = await commentService.update(id, body);
      
      return jsonResponse({ success: true, data: comment });
    } catch (error) {
      console.error('Error updating comment:', error);
      return jsonResponse(
        { success: false, error: 'Failed to update comment' },
        500
      );
    }
  },

  /**
   * DELETE /api/comments/[id]
   * Delete a comment
   */
  async delete(id: string) {
    try {
      await commentService.delete(id);
      
      return jsonResponse({ success: true, message: 'Comment deleted' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      return jsonResponse(
        { success: false, error: 'Failed to delete comment' },
        500
      );
    }
  },
};

