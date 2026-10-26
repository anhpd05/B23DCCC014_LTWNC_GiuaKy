import { useAppSelector } from '../../../app/hooks';
import { DUE_SOON_DAYS, MAX_BORROW } from '../../../constants/library';
import { useNow } from '../../../hooks/useNow';
import { Spinner } from '../../../shared/components/Spinner';
import { daysUntil, formatDayMonth } from '../../../shared/formatDate';
import { useBookActions } from '../hooks/useBookActions';
import { selectBorrowedBooks, selectPendingIds } from '../selectors';

// "Kệ của bạn": luôn hiện đủ MAX_BORROW suất, suất chưa dùng để trống.
export function BorrowedList() {
  const borrowed = useAppSelector(selectBorrowedBooks);
  const pendingIds = useAppSelector(selectPendingIds);
  const { giveBack } = useBookActions();
  const now = useNow();
  const slots = Array.from({ length: MAX_BORROW }, (_, index) => borrowed[index]);

  return (
    <section className="shelf" aria-labelledby="shelf-title">
      <h2 id="shelf-title" className="eyebrow">
        KỆ CỦA BẠN · {borrowed.length}/{MAX_BORROW}
      </h2>
      <ul className="slots">
        {slots.map((book, index) => {
          const left = book ? daysUntil(book.dueAt, now) : 0;
          return (
            <li
              key={book ? book.id : `empty-${index}`}
              className={`slot${book ? ' is-filled' : ''}`}
              data-cat={book?.category}
            >
              <span className="spine" aria-hidden="true" />
              <div className="slot__text">
                <span className="slot__title">{book ? book.title : 'Suất trống'}</span>
                {book && (
                  <span className="slot__due" data-soon={left <= DUE_SOON_DAYS}>
                    Hạn {formatDayMonth(book.dueAt)} · còn {left} ngày
                  </span>
                )}
              </div>
              {book && (
                <button
                  type="button"
                  className="btn btn--chip"
                  title="Trả sách"
                  disabled={pendingIds.includes(book.id)}
                  onClick={() => void giveBack(book.id)}
                >
                  {pendingIds.includes(book.id) ? <Spinner /> : 'Trả'}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
