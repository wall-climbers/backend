import { likeHandlers } from '../../../../../api/likes';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return likeHandlers.getByPost(id, request);
}

