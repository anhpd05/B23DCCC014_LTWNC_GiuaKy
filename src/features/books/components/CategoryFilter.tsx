import { useMemo } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { CATEGORIES } from '../../../types/book';
import type { CategoryFilter as CategoryFilterValue } from '../../../types/book';
import { useFilterStore } from '../../filters/filterStore';
import { selectBooks } from '../selectors';

const OPTIONS: readonly CategoryFilterValue[] = ['Tất cả', ...CATEGORIES];

export function CategoryFilter() {
  const books = useAppSelector(selectBooks);
  const category = useFilterStore((state) => state.category);
  const setCategory = useFilterStore((state) => state.setCategory);

  const counts = useMemo(() => {
    const result: Record<CategoryFilterValue, number> = { 'Tất cả': books.length, CNTT: 0, 'Kinh tế': 0, 'Ngoại ngữ': 0 };
    for (const book of books) result[book.category] += 1;
    return result;
  }, [books]);

  return (
    <div className="chips" role="group" aria-label="Lọc theo thể loại">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className="chip"
          data-cat={option === 'Tất cả' ? undefined : option}
          aria-pressed={category === option}
          onClick={() => setCategory(option)}
        >
          {option !== 'Tất cả' && <i className="dot" aria-hidden="true" />}
          {option}
          <span className="chip__count">{counts[option]}</span>
        </button>
      ))}
    </div>
  );
}
