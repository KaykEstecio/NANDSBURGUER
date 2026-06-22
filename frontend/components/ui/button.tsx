import * as React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-primary text-primary-foreground shadow-[0_3px_0_#681014] hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-[0_5px_0_#681014] active:translate-y-0.5 active:shadow-[0_1px_0_#681014]',
  secondary:
    'bg-secondary text-secondary-foreground shadow-[0_3px_0_#b57c10] hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-[0_5px_0_#b57c10] active:translate-y-0.5 active:shadow-[0_1px_0_#b57c10]',
  outline:
    'border-2 border-foreground/75 bg-card text-foreground hover:border-primary hover:text-primary',
  ghost: 'text-foreground hover:bg-muted',
  destructive:
    'bg-destructive text-destructive-foreground shadow-[0_3px_0_#681014] hover:bg-destructive/90',
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-11 px-5 py-2.5',
  sm: 'h-9 px-4 text-xs',
  lg: 'h-12 px-6 text-base',
  icon: 'size-10 p-0',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-black uppercase tracking-[0.04em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55 [&_[data-icon]]:size-4 [&_[data-icon]]:shrink-0',
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
