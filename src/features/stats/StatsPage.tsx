import { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { MAX_BORROW, TOP_COUNT } from '../../constants/library';
import { useNow } from '../../hooks/useNow';
import { CATEGORIES } from '../../types/book';
import type { CategoryStats } from '../../types/book';
import { PageHeader } from '../../shared/components/PageHeader';
import { daysUntil, formatDayMonth } from '../../shared/formatDate';
import { BookCover } from '../books/components/BookCover';
import { BooksStatusGate } from '../books/components/BooksStatusGate';
import { NoticeBanner } from '../books/components/NoticeBanner';
import { selectBooks, selectBorrowedBooks } from '../books/selectors';
import { useUiStore } from '../ui/uiStore';

export default function StatsPage() {
  const books = useAppSelector(selectBooks);
  const borrowed = useAppSelector(selectBorrowedBooks);
  const openDetail = useUiStore((state) => state.openDetail);
  const now = useNow();
  const top = useMemo(() => [...books].sort((a, b) => b.borrows - a.borrows).slice(0, TOP_COUNT), [books]);
  const maxBorrows = top[0]?.borrows ?? 1;

  const stats = useMemo(() => {
    const titles: CategoryStats = { CNTT: 0, 'Kinh tế': 0, 'Ngoại ngữ': 0 };
    const copies: CategoryStats = { CNTT: 0, 'Kinh tế': 0, 'Ngoại ngữ': 0 };
    const soldOut: CategoryStats = { CNTT: 0, 'Kinh tế': 0, 'Ngoại ngữ': 0 };
    for (const book of books) {
      titles[book.category] += 1;
      copies[book.category] += book.available;
      if (book.available === 0) soldOut[book.category] += 1;
    }
    const totalCopies = CATEGORIES.reduce((sum, category) => sum + copies[category], 0);
    const totalSoldOut = CATEGORIES.reduce((sum, category) => sum + soldOut[category], 0);
    return { titles, copies, soldOut, totalCopies, totalSoldOut };
  }, [books]);

  const totalTitles = books.length;
  const isFull = borrowed.length >= MAX_BORROW;
  const quota = Math.round((borrowed.length / MAX_BORROW) * 100);
  const slots = Array.from({ length: MAX_BORROW }, (_, index) => borrowed[index]);

  return (
    <>
      <PageHeader crumb="QUẢN LÝ / THỐNG KÊ" title="Thống kê" sub="Số liệu cập nhật theo thao tác mượn/trả" />
      <BooksStatusGate>
        <section className="stack">
          <NoticeBanner />

          <div className="kpis">
            <div className="kpi">
              <span>Tổng đầu sách</span>
              <strong>{totalTitles}</strong>
              <small>{CATEGORIES.length} thể loại</small>
            </div>
            <div className="kpi">
              <span>Bản còn trong kho</span>
              <strong>{stats.totalCopies}</strong>
              <small>sẵn sàng cho mượn</small>
            </div>
            <div className="kpi">
              <span>Đầu sách hết bản</span>
              <strong>{stats.totalSoldOut}</strong>
              <small>chờ trả lại</small>
            </div>
            <div className="kpi kpi--dark">
              <span>Đang mượn</span>
              <strong>
                {borrowed.length}
                <em> / {MAX_BORROW}</em>
              </strong>
              <small>{isFull ? 'đã đủ hạn mức' : `còn ${MAX_BORROW - borrowed.length} suất`}</small>
            </div>
          </div>

          <div className="stats-grid">
            <section className="card" aria-labelledby="by-category">
              <div className="card__head">
                <h2 id="by-category">Đầu sách theo thể loại</h2>
                <span className="eyebrow">{totalTitles} ĐẦU SÁCH</span>
              </div>
              <div className="share" aria-hidden="true">
                {CATEGORIES.map((category) => (
                  <span
                    key={category}
                    data-cat={category}
                    style={{ flex: stats.titles[category] || 0.001 }}
                  />
                ))}
              </div>
              <table className="stats-table">
                <thead>
                  <tr>
                    <th scope="col">THỂ LOẠI</th>
                    <th scope="col">ĐẦU</th>
                    <th scope="col">BẢN</th>
                    <th scope="col">HẾT</th>
                    <th scope="col">TỈ LỆ</th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((category) => (
                    <tr key={category} data-cat={category}>
                      <th scope="row">
                        <i className="dot" aria-hidden="true" />
                        {category}
                      </th>
                      <td className="mono">{stats.titles[category]}</td>
                      <td className="mono muted">{stats.copies[category]}</td>
                      <td className="mono muted">{stats.soldOut[category]}</td>
                      <td className="mono">
                        {totalTitles ? Math.round((stats.titles[category] / totalTitles) * 100) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="card" aria-labelledby="borrowed-now">
              <div className="card__head">
                <h2 id="borrowed-now">Sách đang mượn</h2>
                <span className="eyebrow">
                  {borrowed.length}/{MAX_BORROW} SUẤT
                </span>
              </div>
              <ul className="slot-cards">
                {slots.map((book, index) => (
                  <li
                    key={book ? book.id : `empty-${index}`}
                    className={`slot-card${book ? ' is-filled' : ''}`}
                    data-cat={book?.category}
                  >
                    <span className="mono muted slot-card__no">0{index + 1}</span>
                    <span className="spine" aria-hidden="true" />
                    <div className="slot-card__text">
                      <span className="slot-card__title">{book ? book.title : 'Suất trống'}</span>
                      <span className="muted">
                        {book
                          ? `${book.category} · hạn trả ${formatDayMonth(book.dueAt)} (còn ${daysUntil(book.dueAt, now)} ngày)`
                          : 'Chọn sách ở Kho sách để mượn'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="quota">
                <div>
                  <span>Hạn mức mượn</span>
                  <span className="mono">{quota}%</span>
                </div>
                <div className="quota__bar" aria-hidden="true">
                  <span data-full={isFull} style={{ width: `${quota}%` }} />
                </div>
              </div>
            </section>
          </div>

          <section className="card card--top" aria-labelledby="top-borrowed">
            <div className="card__head">
              <h2 id="top-borrowed">Top {TOP_COUNT} được mượn nhiều</h2>
              <span className="eyebrow">LƯỢT MƯỢN HỌC KỲ</span>
            </div>
            <ul className="top-list">
              {top.map((book, index) => (
                <li key={book.id} data-cat={book.category}>
                  <button type="button" className="top-row" onClick={() => openDetail(book.id)}>
                    <span className="top-row__rank">{index + 1}</span>
                    <BookCover book={book} size="top" />
                    <span className="top-row__text">
                      <span className="top-row__title">{book.title}</span>
                      <span className="muted">{book.author}</span>
                    </span>
                    <span className="top-row__bar" aria-hidden="true">
                      <span style={{ width: `${(book.borrows / maxBorrows) * 100}%` }} />
                    </span>
                    <span className="mono top-row__count">{book.borrows}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </BooksStatusGate>
    </>
  );
}
