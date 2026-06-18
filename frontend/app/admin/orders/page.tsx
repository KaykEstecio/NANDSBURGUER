'use client';

import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import { OrderManagement } from '@/components/OrderManagement';
import { LoadingPanel } from '@/components/ui/state-panel';

export default function AdminOrdersPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPanel label="Validando acesso administrativo..." />;
  }

  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  return <OrderManagement />;
}
