import { NextRequest } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { createdResponse, handleApiError } from '@/lib/api-helpers';
import { setAuthCookie } from '@/lib/auth-cookie';
import { registerSchema } from '@/lib/validators';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const input = registerSchema.parse(await request.json());
    const result = await authService.register(input);
    return setAuthCookie(createdResponse(result), result.token);
  } catch (error) {
    return handleApiError(error);
  }
}
