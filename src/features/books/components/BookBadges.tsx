import { HOT_BORROWS, NEW_BOOK_YEAR } from "../../../constants/library";
import type { Book } from "../../../types/book";

type BadgeTone = "ink" | "accent" | "soft";

interface Badge {
  label: string;
  tone: BadgeTone;
}

function getBadges(book: Book): Badge[] {
  const badges: Badge[] = [];
  if (book.year >= NEW_BOOK_YEAR) badges.push({ label: "Mới", tone: "ink" });
  if (book.borrows >= HOT_BORROWS)
    badges.push({ label: "Phổ biến", tone: "accent" });
  if (book.available === 1) badges.push({ label: "Sắp hết", tone: "soft" });
  return badges;
}

// overlay: huy hiệu trắng đặt góc trên bên phải bìa dạng lưới).
export function BookBadges({
  book,
  overlay = false,
}: {
  book: Book;
  overlay?: boolean;
}) {
  return (
    <>
      {getBadges(book).map((badge) => (
        <span
          key={badge.label}
          className={
            overlay ? "badge badge--overlay" : `badge badge--${badge.tone}`
          }
        >
          {badge.label}
        </span>
      ))}
    </>
  );
}
