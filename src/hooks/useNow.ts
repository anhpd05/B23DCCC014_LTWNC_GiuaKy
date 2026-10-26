import { useSyncExternalStore } from "react";
import { NOW_TICK_MS } from "../constants/library";

let now = Date.now();
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((notify) => notify());
    }, NOW_TICK_MS);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) clearInterval(timer);
  };
}

export function useNow(): number {
  return useSyncExternalStore(subscribe, () => now);
}
