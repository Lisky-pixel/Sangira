import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type ContentGridColumns = 2 | 3 | 4

type ContentGridProps = {
  children: ReactNode
  columns?: ContentGridColumns
  className?: string
}

const columnClasses: Record<ContentGridColumns, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
}

export function ContentGrid({
  children,
  columns = 3,
  className,
}: ContentGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6',
        columnClasses[columns],
        className,
      )}
    >
      {children}
    </div>
  )
}
