import { createSafeContext } from '../../shared/createSafeContext';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export const [ThemeContextProvider, useTheme] = createSafeContext<ThemeContextValue>('Theme');
