import type { Post, Comment, Like, User } from '@prisma/client';

// ============================================
// BASE TYPES (Re-export Prisma types)
// ============================================
export type { Post, Comment, Like, User };

// ============================================
// INPUT TYPES - Create Operations
// ============================================
export interface CreateUserInput {
  email: string;
  username: string;
  name?: string;
  avatar?: string;
  bio?: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  imageUrl?: string;
  published?: boolean;
  authorId: string;
}

export interface CreateCommentInput {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string; // For nested replies
}

export interface CreateLikeInput {
  userId: string;
  postId: string;
}

// ============================================
// INPUT TYPES - Update Operations
// ============================================
export interface UpdateUserInput {
  email?: string;
  username?: string;
  name?: string;
  avatar?: string;
  bio?: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  imageUrl?: string;
  published?: boolean;
}

export interface UpdateCommentInput {
  content: string;
}

// ============================================
// RESPONSE TYPES - With Relations
// ============================================
export interface PostWithAuthor extends Post {
  author: User;
}

export interface PostWithComments extends Post {
  comments: Comment[];
}

export interface PostWithLikes extends Post {
  likes: Like[];
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface PostFull extends Post {
  author: User;
  comments: CommentWithAuthor[];
  likes: Like[];
  _count: {
    likes: number;
    comments: number;
  };
}

export interface CommentWithAuthor extends Comment {
  author: User;
}

export interface CommentWithReplies extends Comment {
  author: User;
  replies: CommentWithAuthor[];
}

export interface LikeWithUser extends Like {
  user: User;
}

// ============================================
// PAGINATION TYPES
// ============================================
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

// ============================================
// FILTER TYPES
// ============================================
export interface PostFilters {
  authorId?: string;
  published?: boolean;
  search?: string;
}

export interface CommentFilters {
  postId?: string;
  authorId?: string;
  parentId?: string | null;
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

