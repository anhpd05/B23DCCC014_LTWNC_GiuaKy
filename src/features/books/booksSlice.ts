import { createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../../app/hooks';
import { borrowBookApi, getBooks, returnBookApi } from '../../api/booksApi';
import { DAY_MS, LOAN_DAYS } from '../../constants/library';
import type { NoticeCode } from '../../constants/messages';
import { isApiSuccess } from '../../types/book';
import type { Book, BookId, Loan } from '../../types/book';

type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface BooksState {
  items: Book[];
  loans: Loan[];
  pendingIds: BookId[];
  status: LoadStatus;
  error: string | null;
  warning: NoticeCode | null;
}

const initialState: BooksState = {
  items: [],
  loans: [],
  pendingIds: [],
  status: 'idle',
  error: null,
  warning: null,
};

export const fetchBooks = createAppAsyncThunk(
  'books/fetchBooks',
  async (shouldFail: boolean | undefined, { rejectWithValue }) => {
    const result = await getBooks(shouldFail);
    if (!isApiSuccess(result)) return rejectWithValue(result.error);
    return result.data;
  },
);

// Chống bấm 2 lần: cuốn đang chờ request thì không gửi thêm.
// Không kiểm tra giới hạn mượn ở đây, phần đó chỉ do borrowLimitMiddleware đảm nhận.
const notPending = (id: BookId, { getState }: { getState: () => { books: BooksState } }) =>
  !getState().books.pendingIds.includes(id);

export const requestBorrow = createAppAsyncThunk(
  'books/requestBorrow',
  async (id: BookId, { dispatch, rejectWithValue }) => {
    const result = await borrowBookApi(id);
    if (!isApiSuccess(result)) return rejectWithValue(result.error);
    dispatch(borrowBook(id)); // middleware chặn ở bước commit này nếu đã đủ MAX_BORROW cuốn
    return id;
  },
  { condition: notPending },
);

export const requestReturn = createAppAsyncThunk(
  'books/requestReturn',
  async (id: BookId, { dispatch, rejectWithValue }) => {
    const result = await returnBookApi(id);
    if (!isApiSuccess(result)) return rejectWithValue(result.error);
    dispatch(returnBook(id));
    return id;
  },
  { condition: notPending },
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    borrowBook: {
      // Hạn trả tính ở đây (action creator) để reducer vẫn là hàm thuần.
      prepare: (bookId: BookId) => ({ payload: { bookId, dueAt: Date.now() + LOAN_DAYS * DAY_MS } }),
      reducer(state, action: PayloadAction<Loan>) {
        const { bookId, dueAt } = action.payload;
        const book = state.items.find((item) => item.id === bookId);
        if (!book || book.available <= 0 || state.loans.some((loan) => loan.bookId === bookId)) return;
        book.available -= 1;
        state.loans.push({ bookId, dueAt });
        state.warning = null;
      },
    },
    returnBook(state, action: PayloadAction<BookId>) {
      if (!state.loans.some((loan) => loan.bookId === action.payload)) return;
      const book = state.items.find((item) => item.id === action.payload);
      if (book) book.available += 1;
      state.loans = state.loans.filter((loan) => loan.bookId !== action.payload);
      state.warning = null;
    },
    limitExceeded(state) {
      state.warning = 'BORROW_LIMIT_EXCEEDED';
    },
    clearWarning(state) {
      state.warning = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Lỗi không xác định';
      })
      .addMatcher(isPending(requestBorrow, requestReturn), (state, action) => {
        state.pendingIds.push(action.meta.arg);
      })
      .addMatcher(isFulfilled(requestBorrow, requestReturn), (state, action) => {
        state.pendingIds = state.pendingIds.filter((id) => id !== action.meta.arg);
      })
      .addMatcher(isRejected(requestBorrow, requestReturn), (state, action) => {
        state.pendingIds = state.pendingIds.filter((id) => id !== action.meta.arg);
        state.warning = 'REQUEST_FAILED';
      });
  },
});

export const { borrowBook, returnBook, limitExceeded, clearWarning } = booksSlice.actions;
export default booksSlice.reducer;
