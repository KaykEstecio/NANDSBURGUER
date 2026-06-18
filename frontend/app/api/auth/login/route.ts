import { NextRequest } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { handleApiError, successResponse } from '@/lib/api-helpers';
import { setAuthCookie } from '@/lib/auth-cookie';
import { loginSchema } from '@/lib/validators';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const input = loginSchema.parse(await request.json());
    const result = await authService.login(input);
    return setAuthCookie(successResponse(result), result.token);
  } catch (error) {
    return handleApiError(error);
  }
}
