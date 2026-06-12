import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/product-service';
import { authenticateToken } from '@/lib/auth-middleware';

const productService = new ProductService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '10');
    const categoryId = searchParams.get('categoryId');

    const result = await productService.getProducts(skip, take, categoryId || undefined);
    return NextResponse.json(result, { status: 200 });
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
        { error: 'Only admins can create products' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const product = await productService.createProduct(data, user.userId);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
