import { lazy, Suspense, useEffect, useRef } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import { fetchBooks } from './features/books/booksSlice';
import { BookDrawer } from './features/books/components/BookDrawer';
import { ToastHost } from './features/toast/ToastHost';
import { Sidebar } from './layout/Sidebar';
import { HomePage } from './pages/HomePage';

const StatsPage = lazy(() => import('./features/stats/StatsPage'));

export default function App() {
  const dispatch = useAppDispatch();
  const fetched = useRef(false);

  // Tải sách đúng 1 lần ở App để vào "/" hay "/stats" đều có dữ liệu; ref chặn StrictMode gọi 2 lần.
  // Thêm ?fail vào URL để giả lập API lỗi.
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void dispatch(fetchBooks(new URLSearchParams(window.location.search).has('fail')));
  }, [dispatch]);

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <Suspense fallback={<p className="loader__text">Đang tải...</p>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <BookDrawer />
      <ToastHost />
    </div>
  );
}
