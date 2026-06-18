import { Order } from '../../types';
import { cn } from '../../lib/utils';

const statusCopy: Record<Order['status'], string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  FAILED: 'Falhou',
  CANCELLED: 'Cancelado'
};

const statusClasses: Record<Order['status'], string> = {
  PENDING: 'border-secondary/30 bg-secondary/15 text-[#7a3f00]',
  PAID: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  FAILED: 'border-primary/20 bg-primary/[0.08] text-primary',
  CANCELLED: 'border-border bg-muted text-muted-foreground'
};

export function OrderStatusBadge({
  status,
  className
}: {
  status: Order['status'];
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center rounded-full border px-3 text-xs font-black',
        statusClasses[status],
        className
      )}
    >
      {statusCopy[status]}
    </span>
  );
}
