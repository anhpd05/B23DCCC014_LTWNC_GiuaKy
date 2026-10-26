import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { DAY_MS, LOAN_DAYS, RELATED_COUNT } from '../../../constants/library';
import { TOAST_MESSAGES } from '../../../constants/messages';
import { useNow } from '../../../hooks/useNow';
import { Spinner } from '../../../shared/components/Spinner';
import { formatDayMonth, formatIsbn } from '../../../shared/formatDate';
import type { BookId } from '../../../types/book';
import { useToastStore } from '../../toast/toastStore';
import { useUiStore } from '../../ui/uiStore';
import { useBookActions } from '../hooks/useBookActions';
import { selectBooks, selectLoans, selectPendingIds } from '../selectors';
import { BookBadges } from './BookBadges';
import { BookCover } from './BookCover';

export function BookDrawer() {
  const detailId = useUiStore((state) => state.detailId);
  const openDetail = useUiStore((state) => state.openDetail);
  const closeDetail = useUiStore((state) => state.closeDetail);
  const notifyMe = useUiStore((state) => state.notifyMe);
  const toggleNotify = useUiStore((state) => state.toggleNotify);
  const showToast = useToastStore((state) => state.show);

  const books = useAppSelector(selectBooks);
  const loans = useAppSelector(selectLoans);
  const pendingIds = useAppSelector(selectPendingIds);
  const { borrow, giveBack } = useBookActions();
  const now = useNow();

  // Giữ sách vừa xem để nội dung không biến mất giữa lúc drawer trượt ra.
  const [lastId, setLastId] = useState<BookId | null>(null);
  if (detailId !== null && detailId !== lastId) setLastId(detailId);
  const isOpen = detailId !== null;
  const shownId = detailId ?? lastId;
  const book = books.find((item) => item.id === shownId);

  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Nhớ phần tử đang focus lúc mở để trả focus về khi đóng.
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDetail();
        return;
      }
      const drawer = drawerRef.current;
      if (event.key !== 'Tab' || !drawer) return;
      const focusable = drawer.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const inside = drawer.contains(document.activeElement);
      // Giữ Tab / Shift+Tab xoay vòng bên trong drawer.
      if (event.shiftKey && (!inside || document.activeElement === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [isOpen, closeDetail]);

  const related = useMemo(
    () =>
      book
        ? books
            .filter((item) => item.category === book.category && item.id !== book.id)
            .sort((a, b) => b.borrows - a.borrows)
            .slice(0, RELATED_COUNT)
        : [],
    [books, book],
  );

  const loan = book ? loans.find((item) => item.bookId === book.id) : undefined;
  const isBorrowed = loan !== undefined;
  const isPending = book ? pendingIds.includes(book.id) : false;
  const soldOut = book ? book.available === 0 : false;
  const notifying = book ? notifyMe[book.id] === true : false;

  return (
    <>
      <div className={`overlay${isOpen ? ' is-open' : ''}`} onClick={closeDetail} aria-hidden="true" />
      <aside
        ref={drawerRef}
        className={`drawer${isOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Chi tiết sách"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        {book && (
          <div className="drawer__body" data-cat={book.category}>
            <div className="drawer__top">
              <span className="eyebrow">CHI TIẾT SÁCH · {book.code}</span>
              <button ref={closeRef} type="button" className="icon-btn" aria-label="Đóng" onClick={closeDetail}>
                ×
              </button>
            </div>

            <div className="drawer__hero">
              <BookCover book={book} size="drawer" />
              <div className="drawer__hero-text">
                <div className="drawer__pills">
                  <span className="cat-pill">{book.category}</span>
                  <BookBadges book={book} />
                </div>
                <h2>{book.title}</h2>
                <span className="drawer__author">{book.author}</span>
                <span className="drawer__status" data-alert={soldOut && !isBorrowed}>
                  {isBorrowed
                    ? `Bạn đang mượn · hạn trả ${formatDayMonth(loan.dueAt)}`
                    : soldOut
                      ? 'Đã hết bản — đang chờ bạn đọc trả'
                      : `Có sẵn ${book.available} bản tại kệ ${book.shelf}`}
                </span>
              </div>
            </div>

            <p className="drawer__desc">{book.description}</p>

            <dl className="facts">
              <div>
                <dt>MÃ SÁCH</dt>
                <dd>{book.code}</dd>
              </div>
              <div>
                <dt>ISBN</dt>
                <dd>{formatIsbn(book.isbn)}</dd>
              </div>
              <div>
                <dt>NHÀ XUẤT BẢN</dt>
                <dd>{book.publisher}</dd>
              </div>
              <div>
                <dt>NĂM XUẤT BẢN</dt>
                <dd>{book.year}</dd>
              </div>
              <div>
                <dt>SỐ TRANG</dt>
                <dd>{book.pages} trang</dd>
              </div>
              <div>
                <dt>NGÔN NGỮ</dt>
                <dd>{book.language}</dd>
              </div>
              <div>
                <dt>VỊ TRÍ</dt>
                <dd>Kệ {book.shelf}</dd>
              </div>
              <div>
                <dt>LƯỢT MƯỢN</dt>
                <dd>{book.borrows} lượt</dd>
              </div>
            </dl>

            <div className="stock">
              <div>
                <span>Tình trạng kho</span>
                <span className="mono">
                  {book.available}/{book.total} bản còn
                </span>
              </div>
              <div className="stock__bar" aria-hidden="true">
                <span data-low={book.available <= 1} style={{ width: `${(book.available / book.total) * 100}%` }} />
              </div>
            </div>

            {related.length > 0 && (
              <section className="related" aria-labelledby="related-title">
                <h3 id="related-title" className="eyebrow">
                  CÙNG THỂ LOẠI
                </h3>
                <ul>
                  {related.map((item) => (
                    <li key={item.id}>
                      <button type="button" className="related__btn" onClick={() => openDetail(item.id)}>
                        <BookCover book={item} size="mini" />
                        <span>{item.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="drawer__actions">
              {isBorrowed && (
                <button type="button" className="btn btn--solid btn--lg" disabled={isPending} onClick={() => void giveBack(book.id)}>
                  {isPending ? (
                    <>
                      <Spinner />
                      Đang trả…
                    </>
                  ) : (
                    'Trả sách'
                  )}
                </button>
              )}
              {!isBorrowed && !soldOut && (
                <button type="button" className="btn btn--solid btn--lg" disabled={isPending} onClick={() => void borrow(book.id)}>
                  {isPending ? (
                    <>
                      <Spinner />
                      Đang mượn…
                    </>
                  ) : (
                    `Mượn sách · hạn ${formatDayMonth(now + LOAN_DAYS * DAY_MS)}`
                  )}
                </button>
              )}
              {!isBorrowed && soldOut && (
                <button
                  type="button"
                  className="btn btn--outline btn--lg"
                  aria-pressed={notifying}
                  onClick={() => {
                    toggleNotify(book.id);
                    if (!notifying) showToast(TOAST_MESSAGES.notifyOn, 'back');
                  }}
                >
                  {notifying ? '✓ Sẽ báo khi có sách' : 'Báo cho tôi khi có sách'}
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
