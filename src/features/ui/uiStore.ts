import { create } from 'zustand';
import type { BookId } from '../../types/book';

interface UiState {
  detailId: BookId | null;
  notifyMe: Record<BookId, boolean>;
  imageFailed: Record<BookId, boolean>;
  openDetail: (id: BookId) => void;
  closeDetail: () => void;
  toggleNotify: (id: BookId) => void;
  markImageFailed: (id: BookId) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  detailId: null,
  notifyMe: {},
  imageFailed: {},
  openDetail: (id) => set({ detailId: id }),
  closeDetail: () => set({ detailId: null }),
  toggleNotify: (id) => set((state) => ({ notifyMe: { ...state.notifyMe, [id]: !state.notifyMe[id] } })),
  markImageFailed: (id) => set((state) => ({ imageFailed: { ...state.imageFailed, [id]: true } })),
}));
