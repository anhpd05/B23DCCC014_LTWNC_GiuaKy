import { useFilterStore } from '../../filters/filterStore';
import { isSortKey, SORT_OPTIONS } from '../../filters/sorting';
import { CategoryFilter } from './CategoryFilter';
import { SearchBar } from './SearchBar';

interface ToolbarProps {
  isTyping: boolean;
  hasActiveFilter: boolean;
}

// Thanh công cụ dính đầu trang: tìm kiếm, thể loại, kiểu xem, sắp xếp, lọc "còn bản".
export function Toolbar({ isTyping, hasActiveFilter }: ToolbarProps) {
  const view = useFilterStore((state) => state.view);
  const setView = useFilterStore((state) => state.setView);
  const sort = useFilterStore((state) => state.sort);
  const setSort = useFilterStore((state) => state.setSort);
  const onlyAvailable = useFilterStore((state) => state.onlyAvailable);
  const toggleOnlyAvailable = useFilterStore((state) => state.toggleOnlyAvailable);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  return (
    <div className="toolbar">
      <SearchBar isTyping={isTyping} />
      <CategoryFilter />
      <div className="chips chips--view" role="group" aria-label="Kiểu hiển thị">
        <button
          type="button"
          className="chip"
          aria-pressed={view === 'table'}
          title="Dạng bảng"
          onClick={() => setView('table')}
        >
          ☰ Bảng
        </button>
        <button
          type="button"
          className="chip"
          aria-pressed={view === 'grid'}
          title="Dạng bìa sách"
          onClick={() => setView('grid')}
        >
          ▦ Bìa
        </button>
      </div>
      <div className="toolbar__row">
        <label className="sort">
          Sắp xếp
          <select
            value={sort}
            aria-label="Sắp xếp"
            onChange={(event) => {
              if (isSortKey(event.target.value)) setSort(event.target.value);
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="toggle-pill"
          aria-pressed={onlyAvailable}
          onClick={toggleOnlyAvailable}
        >
          <span className="toggle-pill__box" aria-hidden="true">
            {onlyAvailable ? '✓' : ''}
          </span>
          Chỉ sách còn bản
        </button>
        {hasActiveFilter && (
          <button type="button" className="link-accent" onClick={resetFilters}>
            Xoá bộ lọc
          </button>
        )}
      </div>
    </div>
  );
}
