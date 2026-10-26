import type { ReactNode } from "react";
import { COVER_BASE_URL } from "../../../constants/library";
import type { Book } from "../../../types/book";
import { useUiStore } from "../../ui/uiStore";

type CoverSize =
  | "thumb"
  | "featured"
  | "grid"
  | "drawer"
  | "mini"
  | "top";

interface BookCoverProps {
  book: Book;
  size: CoverSize;
  children?: ReactNode;
}

const BIG_SIZES: readonly CoverSize[] = ["grid", "drawer"];

export function BookCover({ book, size, children }: BookCoverProps) {
  const failed = useUiStore((state) => state.imageFailed[book.id] === true);
  const markImageFailed = useUiStore((state) => state.markImageFailed);
  const isBig = BIG_SIZES.includes(size);

  return (
    <span
      className={`cover cover--${size}`}
      style={{ background: book.coverTone }}
    >
      <span
        className="cover__band"
        data-variant={book.coverVariant}
        data-big={isBig}
      />
      {isBig && (
        <>
          <span className="cover__title">{book.title}</span>
          <span className="cover__author">{book.author}</span>
        </>
      )}
      {!failed && (
        <img
          src={`${COVER_BASE_URL}/${book.isbn}-L.jpg?default=false`}
          alt=""
          loading="lazy"
          onError={() => markImageFailed(book.id)}
        />
      )}
      {children}
    </span>
  );
}
