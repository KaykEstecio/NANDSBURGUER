import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { authenticateToken } from '@/lib/auth-middleware';

const authService = new AuthService();

export async function GET(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    const userData = await authService.getMe(user.userId);
    
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 }
    );
  }
}
