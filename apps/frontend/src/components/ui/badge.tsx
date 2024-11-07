import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900',
        secondary: 'border-transparent bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50',
        destructive: 'border-transparent bg-red-500 text-slate-50 dark:bg-red-900 dark:text-slate-50',
        outline: 'text-slate-950 dark:text-slate-50',
        orange: 'border-transparent bg-orange-500 text-slate-50 dark:bg-orange-900',
        blue: 'border-transparent bg-blue-500 text-slate-50 dark:bg-blue-900',
        gray: 'border-transparent bg-gray-500 text-slate-50 dark:bg-gray-900',
        green: 'border-transparent bg-green-500 text-slate-50 dark:bg-green-900',
        red: 'border-transparent bg-red-500 text-slate-50 dark:bg-red-900',
        yellow: 'border-transparent bg-yellow-500 text-slate-50 dark:bg-yellow-900',
        purple: 'border-transparent bg-purple-500 text-slate-50 dark:bg-purple-900',
      },
      hover: {
        true: 'hover:bg-opacity-80',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, hover = true, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, hover }), className)} {...props} />;
}

export { Badge, badgeVariants };
