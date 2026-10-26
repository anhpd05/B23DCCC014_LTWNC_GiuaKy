import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { BookSummary } from '../../types/book';

export const selectBooks = (state: RootState) => state.books.items;
export const selectBorrowedIds = (state: RootState) => state.books.borrowedIds;
export const selectPendingIds = (state: RootState) => state.books.pendingIds;
export const selectBooksStatus = (state: RootState) => state.books.status;
export const selectBooksError = (state: RootState) => state.books.error;
export const selectBooksWarning = (state: RootState) => state.books.warning;

export const selectBorrowedBooks = createSelector(
  [selectBooks, selectBorrowedIds],
  (items, borrowedIds): BookSummary[] =>
    borrowedIds.flatMap((id) => {
      const book = items.find((item) => item.id === id);
      return book ? [{ id: book.id, title: book.title, author: book.author }] : [];
    }),
);
