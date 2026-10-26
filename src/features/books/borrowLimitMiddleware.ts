import type { Middleware } from "@reduxjs/toolkit";
import { MAX_BORROW } from "../../constants/library";
import { borrowBook, limitExceeded } from "./booksSlice";
import type { BooksState } from "./booksSlice";

// State khai báo cục bộ
type StateWithBooks = { books: BooksState };

export const borrowLimitMiddleware: Middleware<object, StateWithBooks> =
  (api) => (next) => (action) => {
    if (borrowBook.match(action)) {
      const { loans } = api.getState().books;
      if (
        !loans.some((loan) => loan.bookId === action.payload.bookId) &&
        loans.length >= MAX_BORROW
      ) {
        api.dispatch(limitExceeded());
        return action; // chặn: không gọi next
      }
    }
    return next(action);
  };
