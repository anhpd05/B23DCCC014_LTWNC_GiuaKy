import { useAppSelector } from '../app/hooks';
import { BookList } from '../features/books/components/BookList';
import { BooksStatusGate } from '../features/books/components/BooksStatusGate';
import { FeaturedBooks } from '../features/books/components/FeaturedBooks';
import { NoticeBanner } from '../features/books/components/NoticeBanner';
import { Toolbar } from '../features/books/components/Toolbar';
import { useFilteredBooks } from '../features/books/hooks/useFilteredBooks';
import { selectBooksStatus } from '../features/books/selectors';
import { useFilterStore } from '../features/filters/filterStore';
import { PageHeader } from '../shared/components/PageHeader';

export function HomePage() {
  const status = useAppSelector(selectBooksStatus);
  const { filtered, isTyping, hasActiveFilter } = useFilteredBooks();
  const page = useFilterStore((state) => state.page);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  // Có bất kỳ bộ lọc nào (từ khoá, thể loại, "chỉ sách còn bản") thì ẩn khối "nổi bật".
  const showFeatured = !hasActiveFilter && page === 1;

  return (
    <>
      <PageHeader
        crumb="QUẢN LÝ / KHO SÁCH"
        title="Kho sách"
        sub={status === 'succeeded' ? `${filtered.length} đầu sách phù hợp` : undefined}
      />
      <BooksStatusGate>
        <section className="stack">
          <NoticeBanner />
          {showFeatured && <FeaturedBooks />}
          <Toolbar isTyping={isTyping} hasActiveFilter={hasActiveFilter} />
          <BookList books={filtered} onResetFilters={resetFilters} />
        </section>
      </BooksStatusGate>
    </>
  );
}
