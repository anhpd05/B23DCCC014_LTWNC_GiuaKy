import { useEffect, useRef } from "react";
import { useFilterStore } from "../../filters/filterStore";

// Ô nhập điều khiển trực tiếp theo từng phím việc debounce nằm ở useFilteredBooks.
export function SearchBar({ isTyping }: { isTyping: boolean }) {
  const keyword = useFilterStore((state) => state.keyword);
  const setKeyword = useFilterStore((state) => state.setKeyword);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target =
        event.target instanceof HTMLElement ? event.target.tagName : "";
      if (event.key === "/" && target !== "INPUT" && target !== "TEXTAREA") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="search">
      <span className="search__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        ref={inputRef}
        type="search"
        value={keyword}
        aria-label="Tìm sách"
        placeholder="Tìm theo tên sách hoặc tác giả…"
        onChange={(event) => setKeyword(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setKeyword("");
            event.currentTarget.blur();
          }
        }}
      />
      {isTyping && <span className="search__hint">Đang tìm…</span>}
      {!keyword && (
        <kbd className="search__kbd" title="Nhấn / để tìm nhanh">
          /
        </kbd>
      )}
      {keyword && (
        <button
          type="button"
          className="search__clear"
          aria-label="Xoá từ khoá"
          onClick={() => setKeyword("")}
        >
          ×
        </button>
      )}
    </div>
  );
}
