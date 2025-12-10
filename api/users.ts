/**
 * User API Handlers
 * Use these handlers in your Next.js API routes
 * 
 * Example usage in Next.js App Router (app/api/users/route.ts):
 * 
 * import { userHandlers } from '@/backend/api/users';
 * 
 * export async function GET(request: Request) {
 *   return userHandlers.getAll(request);
 * }
 * 
 * export async function POST(request: Request) {
 *   return userHandlers.create(request);
 * }
 */

import { userService } from '../services';
import type { CreateUserInput, UpdateUserInput } from '../types';

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
  };
};

export const userHandlers = {
  /**
   * GET /api/users
   * Get all users with pagination
   */
  async getAll(request: Request) {
    try {
      const { page, limit } = parseParams(request.url);
      const result = await userService.getAll({ page, limit });
      
      return jsonResponse({ success: true, ...result });
    } catch (error) {
      console.error('Error fetching users:', error);
      return jsonResponse(
        { success: false, error: 'Failed to fetch users' },
        500
      );
    }
  },

  /**
   * GET /api/users/[id]
   * Get a single user by ID
   */
  async getById(id: string) {
    try {
      const user = await userService.getById(id);
      
      if (!user) {
        return jsonResponse(
          { success: false, error: 'User not found' },
          404
        );
      }
      
      return jsonResponse({ success: true, data: user });
    } catch (error) {
      console.error('Error fetching user:', error);
      return jsonResponse(
        { success: false, error: 'Failed to fetch user' },
        500
      );
    }
  },

  /**
   * GET /api/users/username/[username]
   * Get a user by username
   */
  async getByUsername(username: string) {
    try {
      const user = await userService.getByUsername(username);
      
      if (!user) {
        return jsonResponse(
          { success: false, error: 'User not found' },
          404
        );
      }
      
      return jsonResponse({ success: true, data: user });
    } catch (error) {
      console.error('Error fetching user:', error);
      return jsonResponse(
        { success: false, error: 'Failed to fetch user' },
        500
      );
    }
  },

  /**
   * POST /api/users
   * Create a new user
   */
  async create(request: Request) {
    try {
      const body = await request.json() as CreateUserInput;
      
      // Validation
      if (!body.email || !body.username) {
        return jsonResponse(
          { success: false, error: 'Email and username are required' },
          400
        );
      }

      // Check if email or username already exists
      const [emailExists, usernameExists] = await Promise.all([
        userService.emailExists(body.email),
        userService.usernameExists(body.username),
      ]);

      if (emailExists) {
        return jsonResponse(
          { success: false, error: 'Email already in use' },
          409
        );
      }

      if (usernameExists) {
        return jsonResponse(
          { success: false, error: 'Username already taken' },
          409
        );
      }

      const user = await userService.create(body);
      
      return jsonResponse({ success: true, data: user }, 201);
    } catch (error) {
      console.error('Error creating user:', error);
      return jsonResponse(
        { success: false, error: 'Failed to create user' },
        500
      );
    }
  },

  /**
   * PUT /api/users/[id]
   * Update a user
   */
  async update(id: string, request: Request) {
    try {
      const body = await request.json() as UpdateUserInput;
      
      // Check if updating email or username to one that already exists
      if (body.email) {
        const existing = await userService.getByEmail(body.email);
        if (existing && existing.id !== id) {
          return jsonResponse(
            { success: false, error: 'Email already in use' },
            409
          );
        }
      }

      if (body.username) {
        const existing = await userService.getByUsername(body.username);
        if (existing && existing.id !== id) {
          return jsonResponse(
            { success: false, error: 'Username already taken' },
            409
          );
        }
      }

      const user = await userService.update(id, body);
      
      return jsonResponse({ success: true, data: user });
    } catch (error) {
      console.error('Error updating user:', error);
      return jsonResponse(
        { success: false, error: 'Failed to update user' },
        500
      );
    }
  },

  /**
   * DELETE /api/users/[id]
   * Delete a user
   */
  async delete(id: string) {
    try {
      await userService.delete(id);
      
      return jsonResponse({ success: true, message: 'User deleted' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return jsonResponse(
        { success: false, error: 'Failed to delete user' },
        500
      );
    }
  },
};

