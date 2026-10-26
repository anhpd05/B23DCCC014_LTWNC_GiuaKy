import { API_DELAY_MS, MUTATION_DELAY_MS } from '../constants/library';
import type { ApiResult, Book, BookId } from '../types/book';

const MOCK_BOOKS: Book[] = [
  { id: 'b01', code: 'IT-001', title: 'Programming TypeScript', author: 'Boris Cherny', category: 'CNTT', year: 2019, available: 3, total: 5, publisher: "O'Reilly", pages: 324, shelf: 'A1', borrows: 128, isbn: '9781492037651', language: 'Tiếng Anh', description: 'Đi sâu vào hệ thống kiểu của TypeScript: generic, utility types, type guard và cách áp dụng vào dự án thực tế.', coverTone: '#2f5d8a', coverVariant: 0 },
  { id: 'b02', code: 'IT-002', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen và cộng sự', category: 'CNTT', year: 2009, available: 0, total: 4, publisher: 'MIT Press', pages: 1312, shelf: 'A1', borrows: 164, isbn: '9780262033848', language: 'Tiếng Anh', description: 'Giáo trình thuật toán kinh điển — sắp xếp, cấu trúc dữ liệu, đồ thị, quy hoạch động — dùng ở hầu hết các trường đại học.', coverTone: '#7a2e2e', coverVariant: 1 },
  { id: 'b03', code: 'IT-003', title: 'Learning React', author: 'Alex Banks, Eve Porcello', category: 'CNTT', year: 2020, available: 2, total: 3, publisher: "O'Reilly", pages: 310, shelf: 'A2', borrows: 97, isbn: '9781492051725', language: 'Tiếng Anh', description: 'Xây dựng ứng dụng React hiện đại với hooks, quản lý state, routing và kiểm thử.', coverTone: '#1f4e5f', coverVariant: 2 },
  { id: 'b04', code: 'IT-004', title: 'Database System Concepts', author: 'Abraham Silberschatz', category: 'CNTT', year: 2010, available: 4, total: 5, publisher: 'McGraw-Hill', pages: 1376, shelf: 'A2', borrows: 61, isbn: '9780073523323', language: 'Tiếng Anh', description: 'Mô hình quan hệ, SQL, chuẩn hoá, giao tác và lưu trữ — nền tảng của môn Cơ sở dữ liệu.', coverTone: '#4b3f72', coverVariant: 0 },
  { id: 'b05', code: 'EC-005', title: 'Principles of Economics', author: 'N. Gregory Mankiw', category: 'Kinh tế', year: 2017, available: 1, total: 4, publisher: 'Cengage', pages: 888, shelf: 'B1', borrows: 88, isbn: '9781305585126', language: 'Tiếng Anh', description: 'Giáo trình kinh tế học nhập môn phổ biến nhất: cung cầu, thị trường, chính sách vĩ mô.', coverTone: '#a0661c', coverVariant: 1 },
  { id: 'b06', code: 'EC-006', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Kinh tế', year: 2011, available: 5, total: 6, publisher: 'Farrar, Straus & Giroux', pages: 499, shelf: 'B1', borrows: 142, isbn: '9780374275631', language: 'Tiếng Anh', description: 'Hai hệ thống tư duy nhanh – chậm và những thiên kiến ảnh hưởng tới quyết định kinh tế.', coverTone: '#3f6e45', coverVariant: 2 },
  { id: 'b07', code: 'EC-007', title: 'Marketing Management', author: 'Philip Kotler, Kevin Lane Keller', category: 'Kinh tế', year: 2015, available: 0, total: 3, publisher: 'Pearson', pages: 832, shelf: 'B2', borrows: 109, isbn: '9780133856460', language: 'Tiếng Anh', description: 'Sách gối đầu ngành marketing: phân khúc, định vị, thương hiệu và chiến lược 4P.', coverTone: '#6b2f4f', coverVariant: 0 },
  { id: 'b08', code: 'NN-008', title: 'English Grammar in Use', author: 'Raymond Murphy', category: 'Ngoại ngữ', year: 2019, available: 6, total: 8, publisher: 'Cambridge University Press', pages: 394, shelf: 'C1', borrows: 152, isbn: '9781108457651', language: 'Tiếng Anh', description: 'Sách ngữ pháp tự học trình độ trung cấp, mỗi bài một trang lý thuyết và một trang luyện tập.', coverTone: '#20435c', coverVariant: 1 },
  { id: 'b09', code: 'NN-009', title: 'Minna no Nihongo Sơ cấp I', author: '3A Corporation', category: 'Ngoại ngữ', year: 2012, available: 2, total: 4, publisher: '3A Network', pages: 256, shelf: 'C2', borrows: 74, isbn: '9784883196036', language: 'Tiếng Nhật', description: 'Giáo trình sơ cấp phổ biến với hội thoại, mẫu câu và từ vựng theo từng bài.', coverTone: '#8a4f2a', coverVariant: 2 },
  { id: 'b10', code: 'NN-010', title: 'Genki I', author: 'Eri Banno và cộng sự', category: 'Ngoại ngữ', year: 2011, available: 1, total: 3, publisher: 'The Japan Times', pages: 384, shelf: 'C2', borrows: 116, isbn: '9784789014403', language: 'Tiếng Nhật', description: 'Giáo trình tiếng Nhật sơ cấp tích hợp nghe – nói – đọc – viết, trình bày sinh động.', coverTone: '#355c4f', coverVariant: 0 },
  { id: 'b11', code: 'IT-011', title: 'Computer Networking: A Top-Down Approach', author: 'James Kurose, Keith Ross', category: 'CNTT', year: 2016, available: 2, total: 4, publisher: 'Pearson', pages: 864, shelf: 'A3', borrows: 55, isbn: '9780133594140', language: 'Tiếng Anh', description: 'Tiếp cận mạng máy tính từ tầng ứng dụng xuống: HTTP, TCP/IP, định tuyến, bảo mật.', coverTone: '#2b2b2b', coverVariant: 1 },
  { id: 'b12', code: 'IT-012', title: 'Clean Code', author: 'Robert C. Martin', category: 'CNTT', year: 2008, available: 3, total: 3, publisher: 'Prentice Hall', pages: 464, shelf: 'A3', borrows: 131, isbn: '9780132350884', language: 'Tiếng Anh', description: 'Nguyên tắc viết code sạch: đặt tên, hàm, xử lý lỗi, kiểm thử và refactor.', coverTone: '#5a3a2a', coverVariant: 2 },
  { id: 'b13', code: 'EC-013', title: 'Freakonomics', author: 'Steven D. Levitt, Stephen J. Dubner', category: 'Kinh tế', year: 2005, available: 2, total: 4, publisher: 'William Morrow', pages: 242, shelf: 'B2', borrows: 49, isbn: '9780060731328', language: 'Tiếng Anh', description: 'Dùng tư duy kinh tế để giải thích những hiện tượng đời thường bất ngờ.', coverTone: '#3a5a7a', coverVariant: 0 },
  { id: 'b14', code: 'NN-014', title: 'Word Power Made Easy', author: 'Norman Lewis', category: 'Ngoại ngữ', year: 2015, available: 0, total: 2, publisher: 'Anchor', pages: 544, shelf: 'C1', borrows: 83, isbn: '9781101873854', language: 'Tiếng Anh', description: 'Mở rộng vốn từ vựng tiếng Anh qua gốc từ, bài tập và lộ trình tự học.', coverTone: '#7d6a1e', coverVariant: 1 },
];

function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

export function getBooks(shouldFail = false, ms = API_DELAY_MS): Promise<ApiResult<Book[]>> {
  return delay(
    shouldFail
      ? { ok: false, error: 'Máy chủ không phản hồi. Vui lòng thử lại.' }
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
