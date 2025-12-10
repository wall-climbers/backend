# Next.js Posts Backend API

A production-ready backend API for Next.js applications featuring Posts, Comments, and Likes functionality. Deployable to **Vercel** with **Neon PostgreSQL** database.

## 🚀 Features

- **User Management**: Create, read, update, delete users
- **Posts**: Create, publish, edit, delete posts with author information
- **Comments**: Nested comments with replies support
- **Likes**: Toggle likes on posts with count tracking
- **Production Ready**: Optimized for Vercel serverless deployment
- **CORS Enabled**: Ready for cross-origin requests from your frontend apps

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database ORM**: Prisma
- **Database**: PostgreSQL (Neon recommended)
- **Hosting**: Vercel
- **Language**: TypeScript

---

## 📦 Production Deployment

### Step 1: Set Up Neon PostgreSQL Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection strings:
   - **DATABASE_URL** (pooled connection): `postgresql://...@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - **DIRECT_URL** (direct connection): `postgresql://...@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

> 💡 In Neon dashboard, click "Connection Details" → Select "Prisma" to get both URLs

### Step 2: Initialize Git Repository

```bash
cd /Users/ericbryan/Desktop/backend
git init
git add .
git commit -m "Initial commit: Posts API backend"
```

### Step 3: Deploy to Vercel

#### Option A: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

#### Option B: Via Vercel Dashboard

1. Push your code to GitHub:
   ```bash
   # Create repo on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/posts-backend.git
   git branch -M main
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and click "New Project"
3. Import your GitHub repository
4. Add environment variables (see Step 4)
5. Click "Deploy"

### Step 4: Configure Environment Variables in Vercel

In your Vercel project settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon pooled connection string |
| `DIRECT_URL` | Your Neon direct connection string |

Example values:
```
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### Step 5: Run Database Migration

After deployment, run migrations:

```bash
# Set your production DATABASE_URL locally temporarily
export DATABASE_URL="your-neon-direct-url"

# Push schema to production database
npx prisma db push

# Or run migrations
npx prisma migrate deploy
```

### Step 6: (Optional) Seed Production Database

```bash
npx prisma db seed
```

---

## 🧪 Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Local Database

Create a `.env` file:

```env
# For local dev with SQLite
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"

# Or use Neon for local dev too
# DATABASE_URL="postgresql://..."
# DIRECT_URL="postgresql://..."
```

If using SQLite locally, update `prisma/schema.prisma`:
```prisma
datasource db {
  provider  = "sqlite"  // Change from "postgresql"
  url       = env("DATABASE_URL")
  // directUrl = env("DIRECT_URL")  // Comment out for SQLite
}
```

### 3. Set Up Database

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Add sample data
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the API documentation.

---

## 📡 API Endpoints

Your deployed API will be available at: `https://your-project.vercel.app`

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | Get all users (paginated) |
| `GET` | `/api/users/[id]` | Get user by ID |
| `POST` | `/api/users` | Create user |
| `PUT` | `/api/users/[id]` | Update user |
| `DELETE` | `/api/users/[id]` | Delete user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts` | Get all posts (paginated) |
| `GET` | `/api/posts/feed` | Get published posts only |
| `GET` | `/api/posts/[id]` | Get post with comments & likes |
| `POST` | `/api/posts` | Create post |
| `PUT` | `/api/posts/[id]` | Update post |
| `DELETE` | `/api/posts/[id]` | Delete post |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts/[id]/comments` | Get comments for post |
| `POST` | `/api/posts/[id]/comments` | Create comment on post |
| `GET` | `/api/comments/[id]` | Get comment by ID |
| `PUT` | `/api/comments/[id]` | Update comment |
| `DELETE` | `/api/comments/[id]` | Delete comment |
| `POST` | `/api/comments/[id]/replies` | Reply to comment |

### Likes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/posts/[id]/like` | Toggle like (like/unlike) |
| `DELETE` | `/api/posts/[id]/like` | Unlike post |
| `GET` | `/api/posts/[id]/like/status?userId=` | Check if user liked post |
| `GET` | `/api/posts/[id]/likes` | Get all likes for post |

---

## 📝 API Usage Examples

### Create a User
```bash
curl -X POST https://your-api.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "username": "john", "name": "John Doe"}'
```

### Create a Post
```bash
curl -X POST https://your-api.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello World", "content": "My first post!", "authorId": "USER_ID", "published": true}'
```

### Add a Comment
```bash
curl -X POST https://your-api.vercel.app/api/posts/POST_ID/comments \
  -H "Content-Type: application/json" \
  -d '{"content": "Great post!", "authorId": "USER_ID"}'
```

### Toggle Like
```bash
curl -X POST https://your-api.vercel.app/api/posts/POST_ID/like \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID"}'
```

### Get Feed with Pagination
```bash
curl "https://your-api.vercel.app/api/posts/feed?page=1&limit=10"
```

---

## 🔗 Using This API in Your Next.js Frontend Apps

### Fetch Posts
```typescript
const response = await fetch('https://your-api.vercel.app/api/posts/feed');
const { data, meta } = await response.json();
```

### Create Post
```typescript
const response = await fetch('https://your-api.vercel.app/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Post',
    content: 'Content here...',
    authorId: currentUser.id,
    published: true,
  }),
});
```

### Toggle Like
```typescript
const response = await fetch(`https://your-api.vercel.app/api/posts/${postId}/like`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: currentUser.id }),
});
const { data } = await response.json();
console.log(data.liked); // true or false
```

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── users/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── posts/
│   │   │   ├── route.ts
│   │   │   ├── feed/route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── comments/route.ts
│   │   │       ├── like/route.ts
│   │   │       ├── like/status/route.ts
│   │   │       └── likes/route.ts
│   │   └── comments/
│   │       └── [id]/
│   │           ├── route.ts
│   │           └── replies/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── api/                 # API handlers
├── services/            # Business logic
├── lib/prisma.ts        # Database client
├── types/               # TypeScript types
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── vercel.json
├── package.json
└── tsconfig.json
```

---

## 🗄 Database Schema

### User
- `id`, `email` (unique), `username` (unique), `name`, `avatar`, `bio`, `createdAt`, `updatedAt`

### Post  
- `id`, `title`, `content`, `imageUrl`, `published`, `authorId`, `createdAt`, `updatedAt`

### Comment
- `id`, `content`, `authorId`, `postId`, `parentId` (for replies), `createdAt`, `updatedAt`

### Like
- `id`, `userId`, `postId`, `createdAt`
- **Unique constraint**: `[userId, postId]`

---

## 📄 License

MIT
