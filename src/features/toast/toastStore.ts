import { create } from 'zustand';

type ToastKind = 'ok' | 'warn' | 'back';

interface ToastData {
  id: number;
  message: string;
  kind: ToastKind;
  onUndo?: () => void;
}

interface ToastState {
  toast: ToastData | null;
  show: (message: string, kind: ToastKind, onUndo?: () => void) => void;
  hide: () => void;
}

let nextToastId = 0;

export const useToastStore = create<ToastState>()((set) => ({
  toast: null,
  show: (message, kind, onUndo) => set({ toast: { id: ++nextToastId, message, kind, onUndo } }),
  hide: () => set({ toast: null }),
}));
