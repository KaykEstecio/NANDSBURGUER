import { NextRequest } from 'next/server';
import { clearAuthCookie } from '@/lib/auth-cookie';
import { handleApiError, successResponse } from '@/lib/api-helpers';

export async function POST(_request: NextRequest) {
  try {
    return clearAuthCookie(successResponse({ loggedOut: true }));
  } catch (error) {
    return handleApiError(error);
  }
}
