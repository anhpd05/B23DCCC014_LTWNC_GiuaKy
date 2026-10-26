import { create } from "zustand";
import type { CategoryFilter } from "../../types/book";

interface FilterState {
  keyword: string;
  category: CategoryFilter;
  page: number;
  setKeyword: (keyword: string) => void;
  setCategory: (category: CategoryFilter) => void;
  setPage: (page: number) => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  keyword: "",
  category: "Tất cả",
  page: 1,
  setKeyword: (keyword) => set({ keyword, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setPage: (page) => set({ page }),
}));
