import type { Middleware } from "@reduxjs/toolkit";
import { MAX_BORROW } from "../../constants/library";
import { borrowBook, limitExceeded } from "./booksSlice";
import type { BooksState } from "./booksSlice";

// State khai báo cục bộ
type StateWithBooks = { books: BooksState };

export const borrowLimitMiddleware: Middleware<object, StateWithBooks> =
  (api) => (next) => (action) => {
    if (borrowBook.match(action)) {
      const { borrowedIds } = api.getState().books;
      if (
        !borrowedIds.includes(action.payload) &&
        borrowedIds.length >= MAX_BORROW
      ) {
        api.dispatch(limitExceeded());
        return action; // chặn: không gọi next
      }
    }
    return next(action);
  };
