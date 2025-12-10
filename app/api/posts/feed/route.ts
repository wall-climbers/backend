import { postHandlers } from '../../../../api/posts';

export async function GET(request: Request) {
  return postHandlers.getFeed(request);
}

