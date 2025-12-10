/**
 * Post API Handlers
 * Use these handlers in your Next.js API routes
 * 
 * Example usage in Next.js App Router (app/api/posts/route.ts):
 * 
 * import { postHandlers } from '@/backend/api/posts';
 * 
 * export async function GET(request: Request) {
 *   return postHandlers.getAll(request);
 * }
 * 
 * export async function POST(request: Request) {
 *   return postHandlers.create(request);
 * }
 */

import { postService } from '../services';
import type { CreatePostInput, UpdatePostInput, PostFilters } from '../types';

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
    limit: parseInt(searchParams.get('limit') || '10'),
    authorId: searchParams.get('authorId') || undefined,
    published: searchParams.get('published') === 'true' ? true : 
               searchParams.get('published') === 'false' ? false : undefined,
    search: searchParams.get('search') || undefined,
  };
};

export const postHandlers = {
  /**
   * GET /api/posts
   * Get all posts with pagination and filters
   */
  async getAll(request: Request) {
    try {
      const { page, limit, authorId, published, search } = parseParams(request.url);
      
      const filters: PostFilters = {};
      if (authorId) filters.authorId = authorId;
      if (published !== undefined) filters.published = published;
      if (search) filters.search = search;

      const result = await postService.getAll({ page, limit }, filters);
      
      return jsonResponse({ success: true, ...result });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return jsonResponse(
        { success: false, error: 'Failed to fetch posts' },
        500
      );
    }
  },

  /**
   * GET /api/posts/[id]
   * Get a single post by ID
   */
  async getById(id: string) {
    try {
      const post = await postService.getById(id);
      
      if (!post) {
        return jsonResponse(
          { success: false, error: 'Post not found' },
          404
        );
      }
      
      return jsonResponse({ success: true, data: post });
    } catch (error) {
      console.error('Error fetching post:', error);
      return jsonResponse(
        { success: false, error: 'Failed to fetch post' },
        500
      );
    }
  },

  /**
   * GET /api/posts/feed
   * Get published posts feed
   */
  async getFeed(request: Request) {
    try {
      const { page, limit } = parseParams(request.url);
      const result = await postService.getFeed({ page, limit });
      
      return jsonResponse({ success: true, ...result });
    } catch (error) {
      console.error('Error fetching feed:', error);
      return jsonResponse(
        { success: false, error: 'Failed to fetch feed' },
        500
      );
    }
  },

  /**
   * POST /api/posts
   * Create a new post
   */
  async create(request: Request) {
    try {
      const body = await request.json() as CreatePostInput;
      
      // Validation
      if (!body.title || !body.content || !body.authorId) {
        return jsonResponse(
          { success: false, error: 'Title, content, and authorId are required' },
          400
        );
      }

      const post = await postService.create(body);
      
      return jsonResponse({ success: true, data: post }, 201);
    } catch (error) {
      console.error('Error creating post:', error);
      return jsonResponse(
        { success: false, error: 'Failed to create post' },
        500
      );
    }
  },

  /**
   * PUT /api/posts/[id]
   * Update a post
   */
  async update(id: string, request: Request) {
    try {
      const body = await request.json() as UpdatePostInput;
      
      const post = await postService.update(id, body);
      
      return jsonResponse({ success: true, data: post });
    } catch (error) {
      console.error('Error updating post:', error);
      return jsonResponse(
        { success: false, error: 'Failed to update post' },
        500
      );
    }
  },

  /**
   * PATCH /api/posts/[id]/publish
   * Publish or unpublish a post
   */
  async setPublished(id: string, published: boolean) {
    try {
      const post = await postService.setPublished(id, published);
      
      return jsonResponse({ success: true, data: post });
    } catch (error) {
      console.error('Error updating post publish status:', error);
      return jsonResponse(
        { success: false, error: 'Failed to update post' },
        500
      );
    }
  },

  /**
   * DELETE /api/posts/[id]
   * Delete a post
   */
  async delete(id: string) {
    try {
      await postService.delete(id);
      
      return jsonResponse({ success: true, message: 'Post deleted' });
    } catch (error) {
      console.error('Error deleting post:', error);
      return jsonResponse(
        { success: false, error: 'Failed to delete post' },
        500
      );
    }
  },
};

