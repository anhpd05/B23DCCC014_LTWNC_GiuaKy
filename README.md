# Mini Library

Ứng dụng tra cứu, mượn và trả sách (LTWNC – kiểm tra giữa kỳ). React 19 + TypeScript + Vite, Redux Toolkit, Zustand, React Context.

Dữ liệu là fake API trong `src/api/booksApi.ts` (Promise + `setTimeout` 500ms), không gọi backend.

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b + vite build, có chunk riêng cho StatsPage
npm test         # Jest + React Testing Library
```

## Tính năng

- Danh sách sách dạng Bảng hoặc Bìa, phân trang 6 / 8 mục mỗi trang.
- Tìm kiếm không phân biệt hoa thường (debounce 300ms), lọc theo thể loại, "Chỉ sách còn bản", 4 kiểu sắp xếp.
- Mượn / trả với loading riêng từng cuốn; tối đa 3 cuốn (chặn bằng middleware tự viết), hạn trả = ngày mượn + 14 ngày.
- Bấm vào một dòng hoặc thẻ để mở drawer chi tiết (`Esc` để đóng, focus được giữ trong drawer).
- Đổi giao diện sáng / tối (Context, lưu lại sau khi tải trang).
- `/stats`: thống kê, lazy load bằng `React.lazy` + `Suspense`.

## Demo trạng thái lỗi

Mở `http://localhost:5173/?fail=1`: API trả `{ ok: false, error }`, màn hình báo lỗi kèm nút **Thử lại**.

## Cấu trúc thư mục

```
src/
  api/booksApi.ts              fake API (getBooks, borrowBookApi, returnBookApi)
  types/book.ts                Book, ApiResult<T>, type guard, utility types
  app/                         store.ts, hooks.ts (typed hooks)
  hooks/                       useDebounce<T>, useNow
  constants/                   hằng số và thông báo
  features/
    books/                     booksSlice, borrowLimitMiddleware, selectors, components/, hooks/
    filters/                   filterStore (Zustand), sorting
    theme/                     ThemeContext, useTheme, ThemeToggle
    toast/, ui/                toast và state giao diện (Zustand)
    stats/StatsPage.tsx        trang /stats (lazy)
  layout/Sidebar.tsx
  pages/HomePage.tsx
  shared/                      createSafeContext, formatDate, components dùng chung
```
