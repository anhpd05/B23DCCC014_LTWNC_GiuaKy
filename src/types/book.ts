export const CATEGORIES = ['CNTT', 'Kinh tế', 'Ngoại ngữ'] as const;
export type Category = (typeof CATEGORIES)[number];
export type CategoryFilter = Category | 'Tất cả';

export type CoverVariant = 0 | 1 | 2;

export interface Book {
  id: string;
  code: string;
  title: string;
  author: string;
  category: Category;
  year: number;
  available: number;
  total: number;
  publisher: string;
  pages: number;
  shelf: string;
  borrows: number;
  isbn: string;
  language: string;
  description: string;
  coverTone: string;
  coverVariant: CoverVariant;
}

// Một lượt mượn: hạn trả = ngày mượn + LOAN_DAYS (tính trong action creator, reducer vẫn thuần).
export interface Loan {
  bookId: string;
  dueAt: number;
}

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: string };
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export function isApiSuccess<T>(result: ApiResult<T>): result is ApiSuccess<T> {
  return result.ok;
}

// Utility types
export type BookId = Book['id'];
export type BookSummary = Pick<Book, 'id' | 'title' | 'author' | 'category'>;
export type BorrowedBook = BookSummary & Pick<Loan, 'dueAt'>;
export type CategoryStats = Record<Category, number>;
export type BookItemProps = Readonly<{
  book: Book;
  order: number;
  isBorrowed: boolean;
  isPending: boolean;
  dueAt?: number;
  onOpen: (id: BookId) => void;
  onBorrow: (id: BookId) => void;
  onReturn: (id: BookId) => void;
}>;
