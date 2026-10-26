import { memo, useState } from 'react';
import { Spinner } from '../../../shared/components/Spinner';
import { isButtonEvent } from '../../../shared/isButtonEvent';
import { formatDayMonth } from '../../../shared/formatDate';
import type { BookItemProps } from '../../../types/book';
import { BookBadges } from './BookBadges';
import { BookCover } from './BookCover';

export const BookItem = memo(function BookItem({
  book,
  order,
  isBorrowed,
  isPending,
  dueAt,
  onOpen,
  onBorrow,
  onReturn,
}: BookItemProps) {
  const soldOut = book.available === 0;

  // Chỉ "nảy" khi số bản đổi sau lần render đầu, không nảy lúc mới gắn vào.
  const [shownAvailable, setShownAvailable] = useState(book.available);
  const [bump, setBump] = useState(false);
  if (shownAvailable !== book.available) {
    setShownAvailable(book.available);
    setBump(true);
  }

  return (
    <li
      className={`book${isBorrowed ? ' is-borrowed' : ''}`}
      data-cat={book.category}
      onClick={(event) => {
        if (!isButtonEvent(event)) onOpen(book.id);
      }}
    >
      <span className="book__no">{String(order).padStart(2, '0')}</span>

      <div className="book__lead">
        <button
          type="button"
          className="cover-btn cover-btn--thumb"
          aria-label={`Xem chi tiết “${book.title}”`}
          onClick={() => onOpen(book.id)}
        >
          <BookCover book={book} size="thumb" />
        </button>
        <div className="book__main">
          <div className="book__titlerow">
            <h3 className="book__title">
              <button type="button" className="link-btn" onClick={() => onOpen(book.id)}>
                {book.title}
              </button>
            </h3>
            <BookBadges book={book} />
          </div>
          <p className="book__by">
            {book.author} · {book.year}
          </p>
          <p className="book__meta">
            <span className="mono">{book.code}</span>
            <span>Kệ {book.shelf}</span>
            <span>{book.publisher}</span>
            <span>{book.pages} trang</span>
            <span>{book.borrows} lượt mượn</span>
            {isBorrowed && (
              <span className="book__flag">
                ● ĐANG MƯỢN{dueAt !== undefined && ` · HẠN ${formatDayMonth(dueAt)}`}
              </span>
            )}
          </p>
        </div>
      </div>

      <span className="book__cat">
        <i className="dot" aria-hidden="true" />
        {book.category}
      </span>

      <div className="book__copies">
        {soldOut ? (
          <span key={book.available} className={`stamp${bump ? ' count-bump' : ''}`}>
            Hết bản
          </span>
        ) : (
          <span key={book.available} className={`count${bump ? ' count-bump' : ''}`}>
            {book.available}/{book.total} bản
          </span>
        )}
        <span className="bar" aria-hidden="true">
          <span
            className="bar__fill"
            data-low={book.available <= 1}
            style={{ width: `${(book.available / book.total) * 100}%` }}
          />
        </span>
      </div>

      <div className="book__action">
        {isBorrowed ? (
          <button type="button" className="btn btn--solid" disabled={isPending} onClick={() => onReturn(book.id)}>
            {isPending ? (
              <>
                <Spinner />
                Đang trả…
              </>
            ) : (
              'Trả'
            )}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--outline"
            disabled={soldOut || isPending}
            title={soldOut ? 'Sách đã hết bản' : 'Mượn cuốn này'}
            onClick={() => onBorrow(book.id)}
          >
            {isPending ? (
              <>
                <Spinner />
                Đang mượn…
              </>
            ) : soldOut ? (
              'Hết sách'
            ) : (
              'Mượn'
            )}
          </button>
        )}
      </div>
    </li>
  );
});
