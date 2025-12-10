export default function Home() {
  return (
    <main style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      color: '#1a1a2e',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          📝 Posts API
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '32px' }}>
          Backend service for Posts, Comments, and Likes
        </p>

        <h2 style={{ fontSize: '1.3rem', marginBottom: '16px', color: '#333' }}>
          Available Endpoints
        </h2>

        <div style={{ display: 'grid', gap: '12px' }}>
          <EndpointGroup title="👤 Users" endpoints={[
            { method: 'GET', path: '/api/users', desc: 'List all users' },
            { method: 'POST', path: '/api/users', desc: 'Create user' },
            { method: 'GET', path: '/api/users/[id]', desc: 'Get user by ID' },
            { method: 'PUT', path: '/api/users/[id]', desc: 'Update user' },
            { method: 'DELETE', path: '/api/users/[id]', desc: 'Delete user' },
          ]} />

          <EndpointGroup title="📄 Posts" endpoints={[
            { method: 'GET', path: '/api/posts', desc: 'List all posts' },
            { method: 'POST', path: '/api/posts', desc: 'Create post' },
            { method: 'GET', path: '/api/posts/feed', desc: 'Get published posts' },
            { method: 'GET', path: '/api/posts/[id]', desc: 'Get post with comments' },
            { method: 'PUT', path: '/api/posts/[id]', desc: 'Update post' },
            { method: 'DELETE', path: '/api/posts/[id]', desc: 'Delete post' },
          ]} />

          <EndpointGroup title="💬 Comments" endpoints={[
            { method: 'GET', path: '/api/posts/[id]/comments', desc: 'Get post comments' },
            { method: 'POST', path: '/api/posts/[id]/comments', desc: 'Add comment' },
            { method: 'POST', path: '/api/comments/[id]/replies', desc: 'Reply to comment' },
            { method: 'PUT', path: '/api/comments/[id]', desc: 'Update comment' },
            { method: 'DELETE', path: '/api/comments/[id]', desc: 'Delete comment' },
          ]} />

          <EndpointGroup title="❤️ Likes" endpoints={[
            { method: 'POST', path: '/api/posts/[id]/like', desc: 'Toggle like' },
            { method: 'GET', path: '/api/posts/[id]/like/status', desc: 'Check like status' },
            { method: 'GET', path: '/api/posts/[id]/likes', desc: 'Get all likes' },
          ]} />
        </div>

        <div style={{ 
          marginTop: '32px', 
          padding: '16px', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#666',
        }}>
          <strong>Status:</strong> ✅ API is running
        </div>
      </div>
    </main>
  );
}

function EndpointGroup({ title, endpoints }: { 
  title: string; 
  endpoints: { method: string; path: string; desc: string }[] 
}) {
  const methodColors: Record<string, string> = {
    GET: '#22c55e',
    POST: '#3b82f6',
    PUT: '#f59e0b',
    DELETE: '#ef4444',
  };

  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      borderRadius: '8px', 
      overflow: 'hidden',
    }}>
      <div style={{ 
        background: '#f8f9fa', 
        padding: '12px 16px', 
        fontWeight: '600',
        borderBottom: '1px solid #e5e7eb',
      }}>
        {title}
      </div>
      <div style={{ padding: '8px' }}>
        {endpoints.map((ep, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '8px',
            fontSize: '0.85rem',
          }}>
            <span style={{ 
              background: methodColors[ep.method], 
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '600',
              minWidth: '52px',
              textAlign: 'center',
            }}>
              {ep.method}
            </span>
            <code style={{ 
              background: '#f1f5f9', 
              padding: '4px 8px', 
              borderRadius: '4px',
              flex: 1,
            }}>
              {ep.path}
            </code>
            <span style={{ color: '#666' }}>{ep.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

