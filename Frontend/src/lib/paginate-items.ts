export function getTotalPages(totalItems: number, pageSize: number): number {
  if (totalItems === 0) {
    return 1
  }

  return Math.ceil(totalItems / pageSize)
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number,
): {
  items: T[]
  totalPages: number
} {
  const totalPages = getTotalPages(items.length, pageSize)
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const offset = (safePage - 1) * pageSize

  return {
    items: items.slice(offset, offset + pageSize),
    totalPages,
  }
}
