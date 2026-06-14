import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sangira-green/40 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-sangira-green text-white hover:bg-sangira-green-dark',
        outline:
          'border border-sangira-green bg-transparent text-sangira-green hover:bg-sangira-green/5',
        ghost:
          'text-sangira-green hover:bg-sangira-green/5',
        link:
          'text-sangira-green underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-11 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
