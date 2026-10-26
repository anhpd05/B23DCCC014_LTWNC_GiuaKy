import { memo } from 'react';
import { Spinner } from '../../../shared/components/Spinner';
import { isButtonEvent } from '../../../shared/isButtonEvent';
import type { BookItemProps } from '../../../types/book';
import { BookBadges } from './BookBadges';
import { BookCover } from './BookCover';

export const BookCard = memo(function BookCard({
  book,
  isBorrowed,
  isPending,
  onOpen,
  onBorrow,
  onReturn,
}: BookItemProps) {
  const soldOut = book.available === 0;

  return (
    <li
      className="card-book"
      data-cat={book.category}
      onClick={(event) => {
        if (!isButtonEvent(event)) onOpen(book.id);
      }}
    >
      <button
        type="button"
        className="cover-btn cover-btn--grid"
        aria-label={`Xem chi tiết “${book.title}”`}
        onClick={() => onOpen(book.id)}
      >
        <BookCover book={book} size="grid">
          <span className="cover__badges">
            <BookBadges book={book} overlay />
          </span>
        </BookCover>
      </button>
      <div className="card-book__text">
        <span className="card-book__title">{book.title}</span>
        <span className="muted">
          {book.author} · Kệ {book.shelf}
        </span>
      </div>
      <div className="card-book__foot">
        {soldOut ? (
          <span className="stamp">Hết bản</span>
        ) : (
          <span className="count">
            {book.available}/{book.total} bản
          </span>
        )}
        {isBorrowed ? (
          <button type="button" className="btn btn--solid btn--card" disabled={isPending} onClick={() => onReturn(book.id)}>
            {isPending ? <Spinner /> : 'Trả'}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--outline btn--card"
            disabled={soldOut || isPending}
            title={soldOut ? 'Sách đã hết bản' : 'Mượn cuốn này'}
            onClick={() => onBorrow(book.id)}
          >
            {isPending ? <Spinner /> : 'Mượn'}
          </button>
        )}
      </div>
    </li>
  );
});
