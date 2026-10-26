import { memo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const Pagination = memo(function Pagination({ currentPage, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="Phân trang">
      <button
        type="button"
        className="page-btn"
        aria-label="Trang trước"
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        ‹
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`page-btn${page === currentPage ? ' is-active' : ''}`}
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className="page-btn"
        aria-label="Trang sau"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        ›
      </button>
    </nav>
  );
});
