import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/category-service';
import { authenticateToken } from '@/lib/auth-middleware';

const categoryService = new CategoryService();

type RouteContext = {
  params: { id: string } | Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const category = await categoryService.getCategoryById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const user = authenticateToken(request);
    
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can update categories' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const category = await categoryService.updateCategory(id, data);
    
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const user = authenticateToken(request);
    
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can delete categories' },
        { status: 403 }
      );
    }

    const category = await categoryService.deleteCategory(id);
    
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
