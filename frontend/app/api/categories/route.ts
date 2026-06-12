import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/category-service';
import { authenticateToken } from '@/lib/auth-middleware';

const categoryService = new CategoryService();

export async function GET(request: NextRequest) {
  try {
    const categories = await categoryService.getCategories();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can create categories' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const category = await categoryService.createCategory(data);
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
