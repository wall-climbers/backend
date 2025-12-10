import { commentHandlers } from '../../../../../api/comments';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return commentHandlers.createReply(id, request);
}

