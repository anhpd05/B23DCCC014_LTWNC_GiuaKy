import type { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchBooks } from "../booksSlice";
import { selectBooksError, selectBooksStatus } from "../selectors";
import { BookSkeleton } from "./BookSkeleton";

export function BooksStatusGate({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectBooksStatus);
  const error = useAppSelector(selectBooksError);

  if (status === "idle" || status === "loading") return <BookSkeleton />;

  if (status === "failed") {
    return (
      <div className="alert-card" role="alert">
        <div>
          <strong>Không tải được danh sách sách</strong>
          <span>{error}</span>
        </div>
        <button
          type="button"
          className="btn btn--accent"
          onClick={() => void dispatch(fetchBooks(false))}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
