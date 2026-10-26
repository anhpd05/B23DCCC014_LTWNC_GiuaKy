import { create } from 'zustand';
import type { CategoryFilter } from '../../types/book';
import type { SortKey, ViewMode } from './sorting';

interface FilterState {
  keyword: string;
  category: CategoryFilter;
  sort: SortKey;
  onlyAvailable: boolean;
  view: ViewMode;
  page: number;
  setKeyword: (keyword: string) => void;
  setCategory: (category: CategoryFilter) => void;
  setSort: (sort: SortKey) => void;
  toggleOnlyAvailable: () => void;
  setView: (view: ViewMode) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

// Mọi setter đổi bộ lọc/kiểu xem đều tự đưa page về 1 ngay trong setter, không cần useEffect để reset.
export const useFilterStore = create<FilterState>()((set) => ({
  keyword: '',
  category: 'Tất cả',
  sort: 'popular',
  onlyAvailable: false,
  view: 'table',
  page: 1,
  setKeyword: (keyword) => set({ keyword, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  toggleOnlyAvailable: () => set((state) => ({ onlyAvailable: !state.onlyAvailable, page: 1 })),
  setView: (view) => set({ view, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ keyword: '', category: 'Tất cả', onlyAvailable: false, page: 1 }),
}));
