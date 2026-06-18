import * as React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md',
  secondary:
    'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/85 hover:shadow-md',
  outline:
    'border border-border bg-card text-foreground shadow-sm hover:border-primary/30 hover:bg-primary/[0.04]',
  ghost: 'text-foreground hover:bg-muted',
  destructive:
    'bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:bg-destructive/90'
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-11 px-5 py-2.5',
  sm: 'h-9 px-4 text-xs',
  lg: 'h-12 px-6 text-base',
  icon: 'size-10 p-0'
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55 [&_[data-icon]]:size-4 [&_[data-icon]]:shrink-0',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export { Button };
