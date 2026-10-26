import { API_DELAY_MS, MUTATION_DELAY_MS } from '../constants/library';
import type { ApiResult, Book, BookId } from '../types/book';

const MOCK_BOOKS: Book[] = [
  { id: 'b1', title: 'Clean Code', author: 'Robert C. Martin', category: 'CNTT', year: 2008, available: 3 },
  { id: 'b2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'CNTT', year: 1999, available: 2 },
  { id: 'b3', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'CNTT', year: 2009, available: 0 },
  { id: 'b4', title: 'Design Patterns', author: 'Erich Gamma', category: 'CNTT', year: 1994, available: 4 },
  { id: 'b5', title: 'Nguyên lý kinh tế học', author: 'N. Gregory Mankiw', category: 'Kinh tế', year: 2014, available: 5 },
  { id: 'b6', title: 'Cha giàu cha nghèo', author: 'Robert Kiyosaki', category: 'Kinh tế', year: 1997, available: 2 },
  { id: 'b7', title: 'Tư duy nhanh và chậm', author: 'Daniel Kahneman', category: 'Kinh tế', year: 2011, available: 1 },
  { id: 'b8', title: 'Quốc gia khởi nghiệp', author: 'Dan Senor', category: 'Kinh tế', year: 2009, available: 0 },
  { id: 'b9', title: 'English Grammar in Use', author: 'Raymond Murphy', category: 'Ngoại ngữ', year: 2019, available: 6 },
  { id: 'b10', title: 'Oxford Word Skills', author: 'Ruth Gairns', category: 'Ngoại ngữ', year: 2008, available: 3 },
  { id: 'b11', title: 'Minna no Nihongo', author: '3A Corporation', category: 'Ngoại ngữ', year: 1998, available: 2 },
  { id: 'b12', title: 'Giáo trình Hán ngữ', author: 'Dương Ký Châu', category: 'Ngoại ngữ', year: 2006, available: 4 },
];

function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

export function getBooks(shouldFail = false, ms = API_DELAY_MS): Promise<ApiResult<Book[]>> {
  return delay(
    shouldFail
      ? { ok: false, error: 'Không tải được danh sách sách. Vui lòng thử lại.' }
      : { ok: true, data: MOCK_BOOKS.map((book) => ({ ...book })) },
    ms,
  );
}

export function borrowBookApi(id: BookId, shouldFail = false, ms = MUTATION_DELAY_MS): Promise<ApiResult<BookId>> {
  return delay(shouldFail ? { ok: false, error: 'Không thể mượn sách lúc này.' } : { ok: true, data: id }, ms);
}

export function returnBookApi(id: BookId, shouldFail = false, ms = MUTATION_DELAY_MS): Promise<ApiResult<BookId>> {
  return delay(shouldFail ? { ok: false, error: 'Không thể trả sách lúc này.' } : { ok: true, data: id }, ms);
}
