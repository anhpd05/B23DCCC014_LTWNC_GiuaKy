import { useMemo } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { useDebounce } from '../../../hooks/useDebounce';
import { useFilterStore } from '../../filters/filterStore';
import { SORTERS } from '../../filters/sorting';
import { selectBooks } from '../selectors';

export function useFilteredBooks() {
  const items = useAppSelector(selectBooks);
  const keyword = useFilterStore((state) => state.keyword);
  const category = useFilterStore((state) => state.category);
  const sort = useFilterStore((state) => state.sort);
  const onlyAvailable = useFilterStore((state) => state.onlyAvailable);
  const debouncedKeyword = useDebounce(keyword);

  const filtered = useMemo(() => {
    const query = debouncedKeyword.trim().toLowerCase();
    return items
      .filter(
        (book) =>
          (category === 'Tất cả' || book.category === category) &&
          (!onlyAvailable || book.available > 0) &&
          (!query || book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)),
      )
      .sort(SORTERS[sort]);
  }, [items, debouncedKeyword, category, onlyAvailable, sort]);

  const hasActiveFilter = debouncedKeyword.trim() !== '' || category !== 'Tất cả' || onlyAvailable;

  return { filtered, debouncedKeyword, isTyping: keyword !== debouncedKeyword, hasActiveFilter };
}
