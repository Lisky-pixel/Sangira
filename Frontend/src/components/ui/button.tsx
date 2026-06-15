import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { Link } from 'react-router'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover',
        outline:
          'border-2 border-primary bg-transparent text-primary hover:bg-primary/5',
        ghost: 'text-primary hover:underline',
      },
      size: {
        default: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

type ButtonLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants>

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
