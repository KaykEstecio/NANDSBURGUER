import { NextRequest } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { createdResponse, handleApiError } from '@/lib/api-helpers';
import { registerSchema } from '@/lib/validators';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const input = registerSchema.parse(await request.json());
    const result = await authService.register(input);
    return createdResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
