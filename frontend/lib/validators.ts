import { z } from 'zod';

const idSchema = z.string().min(1, 'ID obrigatorio');

export const paginationQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(10),
  categoryId: z.string().min(1).optional()
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().trim().email('Email invalido').toLowerCase(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

export const loginSchema = z.object({
  email: z.string().trim().email('Email invalido').toLowerCase(),
  password: z.string().min(1, 'Senha obrigatoria')
});

export const productCreateSchema = z.object({
  name: z.string().trim().min(2, 'Nome obrigatorio'),
  description: z.string().trim().optional().nullable(),
  price: z.coerce.number().positive('Preco deve ser maior que zero'),
  stock: z.coerce.number().int().min(0, 'Estoque nao pode ser negativo'),
  categoryId: idSchema
});

export const productUpdateSchema = productCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'Informe pelo menos um campo para atualizar'
);

export const categoryCreateSchema = z.object({
  name: z.string().trim().min(2, 'Nome obrigatorio'),
  description: z.string().trim().optional().nullable()
});

export const categoryUpdateSchema = categoryCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'Informe pelo menos um campo para atualizar'
);

export const cartItemSchema = z.object({
  productId: idSchema,
  quantity: z.coerce.number().int().min(1, 'Quantidade deve ser maior que zero')
});

export const cartItemUpdateSchema = z.object({
  productId: idSchema.optional(),
  quantity: z.coerce.number().int().min(0, 'Quantidade nao pode ser negativa')
});

export const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'CANCELLED'])
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
