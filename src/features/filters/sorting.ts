import type { Book } from '../../types/book';

export type SortKey = 'popular' | 'newest' | 'az' | 'stock';
export type ViewMode = 'table' | 'grid';

export const SORT_OPTIONS: ReadonlyArray<{ value: SortKey; label: string }> = [
  { value: 'popular', label: 'Mượn nhiều nhất' },
  { value: 'newest', label: 'Mới xuất bản' },
  { value: 'az', label: 'Tên A → Z' },
  { value: 'stock', label: 'Còn nhiều bản' },
];

export const SORTERS: Record<SortKey, (a: Book, b: Book) => number> = {
  popular: (a, b) => b.borrows - a.borrows,
  newest: (a, b) => b.year - a.year,
  az: (a, b) => a.title.localeCompare(b.title, 'vi'),
  stock: (a, b) => b.available - a.available,
};

export function isSortKey(value: string): value is SortKey {
  return SORT_OPTIONS.some((option) => option.value === value);
}
