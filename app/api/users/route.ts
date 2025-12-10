import { userHandlers } from '../../../api/users';

export async function GET(request: Request) {
  return userHandlers.getAll(request);
}

export async function POST(request: Request) {
  return userHandlers.create(request);
}

