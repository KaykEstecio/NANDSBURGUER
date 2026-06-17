import { NextRequest } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { handleApiError, successResponse } from '@/lib/api-helpers';
import { loginSchema } from '@/lib/validators';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const input = loginSchema.parse(await request.json());
    const result = await authService.login(input);
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
