import { createContext, useContext } from 'react';

export function createSafeContext<T>(name: string) {
  const Ctx = createContext<T | null>(null);

  function useCtx(): T {
    const value = useContext(Ctx);
    if (value === null) {
      throw new Error(`use${name} phải được dùng bên trong <${name}>`);
    }
    return value;
  }

  return [Ctx.Provider, useCtx] as const;
}
