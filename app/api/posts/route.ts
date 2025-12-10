import { postHandlers } from '../../../api/posts';

export async function GET(request: Request) {
  return postHandlers.getAll(request);
}

export async function POST(request: Request) {
  return postHandlers.create(request);
}

