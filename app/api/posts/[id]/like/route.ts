import { likeHandlers } from '../../../../../api/likes';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return likeHandlers.toggle(id, request);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return likeHandlers.unlike(id, request);
}

