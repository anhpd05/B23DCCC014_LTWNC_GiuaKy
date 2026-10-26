export const CATEGORIES = ['CNTT', 'Kinh tế', 'Ngoại ngữ'] as const;
export type Category = (typeof CATEGORIES)[number];
export type CategoryFilter = Category | 'Tất cả';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  year: number;
  available: number;
}

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: string };
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export function isApiSuccess<T>(result: ApiResult<T>): result is ApiSuccess<T> {
  return result.ok;
}

// Utility types
export type BookId = Book['id'];
export type BookSummary = Pick<Book, 'id' | 'title' | 'author'>;
export type CategoryStats = Record<Category, number>;
export type BookItemProps = Readonly<{
  book: Book;
  isBorrowed: boolean;
  onBorrow: (id: BookId) => void;
  onReturn: (id: BookId) => void;
}>;
