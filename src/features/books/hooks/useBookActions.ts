import { useCallback } from 'react';
import { useAppDispatch, useAppStore } from '../../../app/hooks';
import { MAX_BORROW } from '../../../constants/library';
import { TOAST_MESSAGES } from '../../../constants/messages';
import { formatDayMonth } from '../../../shared/formatDate';
import type { BookId } from '../../../types/book';
import { useToastStore } from '../../toast/toastStore';
import { requestBorrow, requestReturn } from '../booksSlice';

// Gom thao tác mượn/trả + toast vào một chỗ; hai handler ổn định để React.memo của BookItem có hiệu quả.
export function useBookActions() {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const showToast = useToastStore((state) => state.show);

  const titleOf = useCallback(
    (id: BookId) => store.getState().books.items.find((book) => book.id === id)?.title ?? '',
    [store],
  );

  const giveBack = useCallback(
    async (id: BookId, silent = false) => {
      const result = await dispatch(requestReturn(id));
      if (!requestReturn.fulfilled.match(result) || silent) return;
      showToast(TOAST_MESSAGES.returned(titleOf(id)), 'back');
    },
    [dispatch, showToast, titleOf],
  );

  const borrow = useCallback(
    async (id: BookId) => {
      const result = await dispatch(requestBorrow(id));
      if (!requestBorrow.fulfilled.match(result)) return;
      const { loans } = store.getState().books;
      const loan = loans.find((item) => item.bookId === id);
      if (loan) {
        showToast(
          TOAST_MESSAGES.borrowed(titleOf(id), formatDayMonth(loan.dueAt)),
          'ok',
          () => void giveBack(id, true),
        );
      } else if (loans.length >= MAX_BORROW) {
        showToast(TOAST_MESSAGES.limitReached, 'warn');
      }
    },
    [dispatch, store, showToast, titleOf, giveBack],
  );

  return { borrow, giveBack };
}
