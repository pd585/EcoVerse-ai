/**
 * Button component with aurora/glass/ghost variants.
 * @module components/ui/Button
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-aurora text-primary-foreground shadow-[var(--glow-emerald)] hover:scale-105',
        secondary:
          'border border-border bg-card/30 text-foreground backdrop-blur hover:bg-card/60',
        ghost:
          'text-muted-foreground hover:text-foreground hover:bg-secondary/60',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        glass:
          'glass text-foreground hover:-translate-y-0.5 hover:shadow-[var(--glow-emerald)]',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-secondary/40',
      },
      size: {
        sm: 'h-8 px-4 text-xs',
        md: 'h-10 px-5 py-2.5',
        lg: 'h-12 px-7 py-3.5',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { buttonVariants };
