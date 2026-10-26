import { useMemo } from 'react';
import { PAGE_SIZE } from '../constants/library';

interface PaginationResult<T> {
  pageItems: T[];
  totalPages: number;
  currentPage: number;
}

// Hook thuần tính toán, không giữ state: trang hiện tại luôn lấy từ Zustand.
export function usePagination<T>(
  items: readonly T[],
  page: number,
  pageSize = PAGE_SIZE,
): PaginationResult<T> {
  return useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const start = (currentPage - 1) * pageSize;
    return { pageItems: items.slice(start, start + pageSize), totalPages, currentPage };
  }, [items, page, pageSize]);
}
