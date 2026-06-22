import { NextRequest } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { authenticateToken } from '@/lib/auth-middleware';
import { handleApiError, successResponse } from '@/lib/api-helpers';

const authService = new AuthService();

export async function GET(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    const userData = await authService.getMe(user.userId);

    return successResponse(userData);
  } catch (error) {
    return handleApiError(error);
  }
}
