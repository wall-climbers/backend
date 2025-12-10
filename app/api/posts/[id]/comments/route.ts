import { commentHandlers } from '../../../../../api/comments';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return commentHandlers.getByPost(id, request);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return commentHandlers.create(id, request);
}

