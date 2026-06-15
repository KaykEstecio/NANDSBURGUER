import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/product-service';
import { authenticateToken } from '@/lib/auth-middleware';

const productService = new ProductService();

type RouteContext = {
  params: { id: string } | Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const product = await productService.getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
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
        { error: 'Only admins can update products' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const product = await productService.updateProduct(id, data);
    
    return NextResponse.json(product, { status: 200 });
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
        { error: 'Only admins can delete products' },
        { status: 403 }
      );
    }

    const product = await productService.deleteProduct(id);
    
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
