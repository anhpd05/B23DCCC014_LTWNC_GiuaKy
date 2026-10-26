import { useTheme } from './useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      role="switch"
      aria-checked={isDark}
      aria-label="Chuyển giao diện sáng / tối"
      onClick={toggleTheme}
    >
      <span>Giao diện {isDark ? 'tối' : 'sáng'}</span>
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__knob" />
      </span>
    </button>
  );
}
