import { NextRequest } from 'next/server';
import { ProductService } from '@/lib/product-service';
import { authenticateToken } from '@/lib/auth-middleware';
import {
  forbiddenResponse,
  handleApiError,
  notFoundResponse,
  successResponse
} from '@/lib/api-helpers';
import { productUpdateSchema } from '@/lib/validators';

const productService = new ProductService();

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const product = await productService.getProductById(id);
    
    if (!product) {
      return notFoundResponse('Produto');
    }

    return successResponse(product);
  } catch (error) {
    return handleApiError(error);
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
      return forbiddenResponse();
    }

    const data = productUpdateSchema.parse(await request.json());
    const product = await productService.updateProduct(id, data);
    
    return successResponse(product);
  } catch (error) {
    return handleApiError(error);
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
      return forbiddenResponse();
    }

    const product = await productService.deleteProduct(id);
    
    return successResponse(product);
  } catch (error) {
    return handleApiError(error);
  }
}
