import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex h-fit items-center rounded border border-slate-200 px-2 py-0.5 text-s font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300 flex gap-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80',
        secondary:
          'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
        destructive:
          'border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80',
        outline: 'text-slate-950 dark:text-slate-50',
        blue: 'border-transparent bg-blue-500 text-slate-50 hover:bg-blue-500/80 dark:bg-blue-900 dark:hover:bg-blue-900/80',
        gray: 'border-transparent bg-gray-500 text-slate-50 hover:bg-gray-500/80 dark:bg-gray-900 dark:hover:bg-gray-900/80',
        green:
          'border-transparent bg-green-500 text-slate-50 hover:bg-green-500/80 dark:bg-green-900 dark:hover:bg-green-900/80',
        red: 'border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:hover:bg-red-900/80',
        yellow:
          'border-transparent bg-yellow-500 text-slate-50 hover:bg-yellow-500/80 dark:bg-yellow-900 dark:hover:bg-yellow-900/80',
        purple:
          'border-transparent bg-purple-500 text-slate-50 hover:bg-purple-500/80 dark:bg-purple-900 dark:hover:bg-purple-900/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
