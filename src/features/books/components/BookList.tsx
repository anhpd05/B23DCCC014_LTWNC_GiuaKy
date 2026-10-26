import { useCallback, useMemo, useRef } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { GRID_PAGE_SIZE, PAGE_SIZE } from '../../../constants/library';
import { usePagination } from '../../../hooks/usePagination';
import { Pagination } from '../../../shared/components/Pagination';
import type { Book } from '../../../types/book';
import { useFilterStore } from '../../filters/filterStore';
import { useUiStore } from '../../ui/uiStore';
import { useBookActions } from '../hooks/useBookActions';
import { selectLoans, selectPendingIds } from '../selectors';
import { BookCard } from './BookCard';
import { BookItem } from './BookItem';

interface BookListProps {
  books: Book[];
  onResetFilters: () => void;
}

export function BookList({ books, onResetFilters }: BookListProps) {
  const view = useFilterStore((state) => state.view);
  const page = useFilterStore((state) => state.page);
  const setPage = useFilterStore((state) => state.setPage);
  const pageSize = view === 'grid' ? GRID_PAGE_SIZE : PAGE_SIZE;
  const { pageItems, totalPages, currentPage } = usePagination(books, page, pageSize);

  const loans = useAppSelector(selectLoans);
  const pendingIds = useAppSelector(selectPendingIds);
  const dueByBook = useMemo(() => new Map(loans.map((loan) => [loan.bookId, loan.dueAt])), [loans]);
  const pendingSet = useMemo(() => new Set(pendingIds), [pendingIds]);

  const { borrow, giveBack } = useBookActions();
  const openDetail = useUiStore((state) => state.openDetail);
  const topRef = useRef<HTMLDivElement>(null);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(nextPage);
      // Không ép behavior: CSS (html { scroll-behavior }) quyết định, nên reduced-motion tự tắt cuộn mượt.
      topRef.current?.scrollIntoView?.({ block: 'start' });
    },
    [setPage],
  );

  const start = (currentPage - 1) * pageSize;
  const renderItem = (book: Book, index: number) => {
    const Item = view === 'grid' ? BookCard : BookItem;
    return (
      <Item
        key={book.id}
        book={book}
        order={start + index + 1}
        isBorrowed={dueByBook.has(book.id)}
        isPending={pendingSet.has(book.id)}
        dueAt={dueByBook.get(book.id)}
        onOpen={openDetail}
        onBorrow={borrow}
        onReturn={giveBack}
      />
    );
  };

  const empty = (
    <div className={`empty${view === 'grid' ? ' empty--dashed' : ''}`}>
      <strong>Không tìm thấy sách phù hợp</strong>
      <span>Thử từ khoá khác hoặc bỏ bộ lọc thể loại.</span>
      <button type="button" className="btn btn--outline btn--sm" onClick={onResetFilters}>
        Xoá bộ lọc
      </button>
    </div>
  );

  return (
    <>
      <div ref={topRef} className="list-anchor">
        {pageItems.length === 0 ? (
          <div className="panel">{empty}</div>
        ) : view === 'grid' ? (
          <ul className="book-grid">{pageItems.map(renderItem)}</ul>
        ) : (
          <div className="panel">
            <div className="book-head" aria-hidden="true">
              <span>STT</span>
              <span>TÊN SÁCH / TÁC GIẢ</span>
              <span>THỂ LOẠI</span>
              <span>CÒN LẠI</span>
              <span />
            </div>
            <ul className="book-list">{pageItems.map(renderItem)}</ul>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pager-row">
          <span className="muted">
            Hiển thị {start + 1}–{start + pageItems.length} trên {books.length} đầu sách
          </span>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={handlePageChange} />
        </div>
      )}
    </>
  );
}
