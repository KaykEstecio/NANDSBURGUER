'use client';

import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import { OrderManagement } from '@/components/OrderManagement';

export default function AdminOrdersPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  return <OrderManagement />;
}
