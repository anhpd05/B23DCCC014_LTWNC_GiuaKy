import { useMemo } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { FEATURED_COUNT } from '../../../constants/library';
import { useUiStore } from '../../ui/uiStore';
import { useBookActions } from '../hooks/useBookActions';
import { selectBooks, selectBorrowedIds, selectPendingIds } from '../selectors';
import { BookCover } from './BookCover';

export function FeaturedBooks() {
  const items = useAppSelector(selectBooks);
  const borrowedIds = useAppSelector(selectBorrowedIds);
  const pendingIds = useAppSelector(selectPendingIds);
  const openDetail = useUiStore((state) => state.openDetail);
  const { borrow } = useBookActions();

  const featured = useMemo(
    () => [...items].sort((a, b) => b.borrows - a.borrows).slice(0, FEATURED_COUNT),
    [items],
  );

  return (
    <section className="featured" aria-labelledby="featured-title">
      <div className="featured__head">
        <h2 id="featured-title">Được mượn nhiều nhất</h2>
        <span className="muted">Theo tổng lượt mượn học kỳ này</span>
      </div>
      <ul className="featured__grid">
        {featured.map((book, index) => {
          const isBorrowed = borrowedIds.includes(book.id);
          const isPending = pendingIds.includes(book.id);
          const soldOut = book.available === 0;
          return (
            <li key={book.id} className="featured__card" data-cat={book.category}>
              <button
                type="button"
                className="cover-btn"
                aria-label={`Xem chi tiết “${book.title}”`}
                onClick={() => openDetail(book.id)}
              >
                <BookCover book={book} size="featured">
                  <span className="cover__rank">#{index + 1}</span>
                </BookCover>
              </button>
              <div className="featured__body">
                <span className="featured__title">{book.title}</span>
                <span className="muted">{book.author}</span>
                <div className="featured__foot">
                  <span className="featured__stat">
                    {book.borrows} lượt · {soldOut ? 'hết bản' : `còn ${book.available}`}
                  </span>
                  <button
                    type="button"
                    className={`btn btn--outline btn--xs${isBorrowed ? ' is-done' : ''}`}
                    disabled={soldOut || isBorrowed || isPending}
                    onClick={() => void borrow(book.id)}
                  >
                    {isBorrowed ? 'Đã mượn' : soldOut ? 'Hết' : isPending ? '…' : 'Mượn'}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
