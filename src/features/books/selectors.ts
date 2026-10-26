import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { BorrowedBook } from '../../types/book';

export const selectBooks = (state: RootState) => state.books.items;
export const selectLoans = (state: RootState) => state.books.loans;
export const selectPendingIds = (state: RootState) => state.books.pendingIds;
export const selectBooksStatus = (state: RootState) => state.books.status;
export const selectBooksError = (state: RootState) => state.books.error;
export const selectBooksWarning = (state: RootState) => state.books.warning;

export const selectBorrowedIds = createSelector([selectLoans], (loans) => loans.map((loan) => loan.bookId));

export const selectBorrowedBooks = createSelector(
  [selectBooks, selectLoans],
  (items, loans): BorrowedBook[] =>
    loans.flatMap(({ bookId, dueAt }) => {
      const book = items.find((item) => item.id === bookId);
      return book
        ? [{ id: book.id, title: book.title, author: book.author, category: book.category, dueAt }]
        : [];
    }),
);
