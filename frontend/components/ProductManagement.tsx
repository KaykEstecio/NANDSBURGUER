'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../services/api';
import { Category, Product, ProductInput } from '../types';
import { formatCurrency } from '../lib/invoice';
import { Button } from './ui/button';
import { Input, Textarea, inputClassName } from './ui/input';
import { LoadingPanel, StatePanel } from './ui/state-panel';

const PAGE_SIZE = 8;

type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

const emptyForm = {
  name: '',
  description: '',
  imageUrl: '',
  price: '',
  stock: '',
  categoryId: '',
  isActive: true
};

interface ProductManagementProps {
  categories: Category[];
  onProductsChanged: () => void;
}

export function ProductManagement({
  categories,
  onProductsChanged
}: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [lowStock, setLowStock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await apiClient.getAdminProducts({
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        search: search || undefined,
        categoryId: categoryId || undefined,
        isActive: status === 'ALL' ? undefined : status === 'ACTIVE',
        lowStock: lowStock || undefined
      });
      setProducts(result.products);
      setTotal(result.total);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Erro ao carregar produtos.');
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, lowStock, page, search, status]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const resultCopy = useMemo(() => {
    if (total === 1) return '1 produto encontrado';
    return `${total} produtos encontrados`;
  }, [total]);

  function resetForm() {
    setEditingProduct(null);
    setForm(emptyForm);
  }

  function startEditing(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.categoryId,
      isActive: product.isActive
    });
    setMessage('');
    setError('');
    document.getElementById('product-editor')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  function applySearch(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function clearFilters() {
    setSearchInput('');
    setSearch('');
    setCategoryId('');
    setStatus('ALL');
    setLowStock(false);
    setPage(1);
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');

    const payload: ProductInput = {
      name: form.name,
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId,
      isActive: form.isActive
    };

    try {
      if (editingProduct) {
        await apiClient.updateProduct(editingProduct.id, payload);
        setMessage(`Produto "${payload.name}" atualizado com sucesso.`);
      } else {
        await apiClient.createProduct(payload);
        setMessage(`Produto "${payload.name}" criado com sucesso.`);
      }

      resetForm();
      setPage(1);
      await loadProducts();
      onProductsChanged();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Erro ao salvar produto.');
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleProductStatus(product: Product) {
    setUpdatingStatusId(product.id);
    setError('');
    setMessage('');

    try {
      const nextStatus = !product.isActive;
      await apiClient.updateProduct(product.id, { isActive: nextStatus });
      setMessage(
        `Produto "${product.name}" ${nextStatus ? 'ativado' : 'desativado'} com sucesso.`
      );
      await loadProducts();
      onProductsChanged();
    } catch (statusError) {
      setError(
        statusError instanceof Error ? statusError.message : 'Erro ao alterar status do produto.'
      );
    } finally {
      setUpdatingStatusId(null);
    }
  }

  return (
    <section className="surface-panel rounded-[1.25rem] p-5 sm:p-7">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black text-primary">Produtos</p>
          <h2 className="mt-2 text-2xl font-black">Gestao do cardapio</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Crie, edite e controle a visibilidade dos itens sem apagar o historico de pedidos.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={resetForm}>
          Novo produto
        </Button>
      </div>

      {message ? (
        <div
          role="status"
          className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
        >
          {message}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-primary/25 bg-primary/[0.06] px-4 py-3 text-sm font-semibold text-primary"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] xl:items-start">
        <div className="space-y-5">
          <form onSubmit={applySearch} className="rounded-xl border border-border bg-muted/35 p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2 text-sm font-bold md:col-span-2">
                <span>Buscar por nome</span>
                <div className="flex gap-2">
                  <Input
                    type="search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Ex.: Nands Classic"
                  />
                  <Button type="submit">Buscar</Button>
                </div>
              </label>

              <label className="space-y-2 text-sm font-bold">
                <span>Categoria</span>
                <select
                  value={categoryId}
                  onChange={(event) => {
                    setCategoryId(event.target.value);
                    setPage(1);
                  }}
                  className={inputClassName}
                >
                  <option value="">Todas</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-bold">
                <span>Status</span>
                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value as StatusFilter);
                    setPage(1);
                  }}
                  className={inputClassName}
                >
                  <option value="ALL">Todos</option>
                  <option value="ACTIVE">Ativos</option>
                  <option value="INACTIVE">Inativos</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-2 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={lowStock}
                  onChange={(event) => {
                    setLowStock(event.target.checked);
                    setPage(1);
                  }}
                  className="size-4 accent-primary"
                />
                Somente estoque baixo (10 ou menos)
              </label>
              <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                Limpar filtros
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-muted-foreground">{resultCopy}</p>
            <p className="text-xs font-bold text-muted-foreground">
              Pagina {page} de {pageCount}
            </p>
          </div>

          {isLoading ? (
            <LoadingPanel label="Carregando produtos..." className="min-h-64" />
          ) : products.length === 0 ? (
            <StatePanel
              title="Nenhum produto encontrado"
              description="Ajuste a busca ou os filtros para encontrar outros itens."
              actionLabel="Limpar filtros"
              onAction={clearFilters}
            />
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center"
                >
                  <div
                    className="aspect-square rounded-lg bg-muted bg-cover bg-center"
                    style={
                      product.imageUrl
                        ? { backgroundImage: `url(${product.imageUrl})` }
                        : undefined
                    }
                    role="img"
                    aria-label={product.imageUrl ? `Imagem de ${product.name}` : 'Produto sem imagem personalizada'}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-black">{product.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-black ${
                          product.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {product.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.category?.name || 'Sem categoria'} - {formatCurrency(product.price)}
                    </p>
                    <p className={`mt-1 text-sm font-bold ${product.stock <= 10 ? 'text-primary' : ''}`}>
                      Estoque: {product.stock}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => startEditing(product)}>
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant={product.isActive ? 'outline' : 'secondary'}
                      size="sm"
                      disabled={updatingStatusId === product.id}
                      onClick={() => toggleProductStatus(product)}
                    >
                      {updatingStatusId === product.id
                        ? 'Salvando...'
                        : product.isActive
                          ? 'Desativar'
                          : 'Ativar'}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={page === 1 || isLoading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={page >= pageCount || isLoading}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            >
              Proxima
            </Button>
          </div>
        </div>

        <form
          id="product-editor"
          onSubmit={saveProduct}
          className="rounded-[1.25rem] bg-[#15110f] p-5 text-white shadow-grill xl:sticky xl:top-24"
        >
          <p className="text-sm font-black text-secondary">
            {editingProduct ? 'Edicao de produto' : 'Novo produto'}
          </p>
          <h3 className="mt-2 text-2xl font-black">
            {editingProduct ? editingProduct.name : 'Adicionar ao cardapio'}
          </h3>

          <div className="mt-6 space-y-4">
            <label className="block space-y-2 text-sm font-bold">
              <span>Nome</span>
              <Input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="border-white/15 bg-white/[0.06] text-white placeholder:text-white/40"
              />
            </label>

            <label className="block space-y-2 text-sm font-bold">
              <span>Descricao</span>
              <Textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="border-white/15 bg-white/[0.06] text-white placeholder:text-white/40"
                rows={3}
              />
            </label>

            <label className="block space-y-2 text-sm font-bold">
              <span>URL da imagem</span>
              <Input
                type="url"
                value={form.imageUrl}
                onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
                placeholder="https://..."
                className="border-white/15 bg-white/[0.06] text-white placeholder:text-white/40"
              />
            </label>

            {form.imageUrl ? (
              <div
                className="aspect-[16/9] rounded-xl bg-white/5 bg-cover bg-center"
                style={{ backgroundImage: `url(${form.imageUrl})` }}
                aria-label="Previa da imagem do produto"
              />
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-bold">
                <span>Preco</span>
                <Input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  className="border-white/15 bg-white/[0.06] text-white"
                />
              </label>
              <label className="space-y-2 text-sm font-bold">
                <span>Estoque</span>
                <Input
                  required
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) => setForm({ ...form, stock: event.target.value })}
                  className="border-white/15 bg-white/[0.06] text-white"
                />
              </label>
            </div>

            <label className="block space-y-2 text-sm font-bold">
              <span>Categoria</span>
              <select
                required
                value={form.categoryId}
                onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                className={`${inputClassName} border-white/15 bg-white/[0.06] text-white`}
              >
                <option value="" disabled className="text-black">
                  Selecionar categoria
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="text-black">
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/[0.06] p-4 text-sm font-bold">
              <span>
                Produto ativo
                <span className="mt-1 block text-xs font-normal text-white/55">
                  Itens inativos nao aparecem no cardapio publico.
                </span>
              </span>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                className="size-5 accent-secondary"
              />
            </label>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {editingProduct ? (
              <Button type="button" variant="outline" onClick={resetForm} className="border-white/20 bg-transparent text-white hover:bg-white/10">
                Cancelar
              </Button>
            ) : null}
            <Button type="submit" disabled={isSaving} className={editingProduct ? '' : 'sm:col-span-2'}>
              {isSaving ? 'Salvando...' : editingProduct ? 'Salvar alteracoes' : 'Criar produto'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
