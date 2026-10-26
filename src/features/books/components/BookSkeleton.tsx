import { SKELETON_ROWS } from '../../../constants/library';

const TITLE_WIDTHS = ['70%', '55%', '80%', '62%'];

export function BookSkeleton() {
  return (
    <>
      <div className="loader" role="status" aria-live="polite">
        <div className="loader__books" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="loader__text">Đang tải...</span>
      </div>
      <div className="panel" aria-hidden="true">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <div className="skeleton-row" key={index}>
            <span className="skeleton skeleton--no" />
            <div className="skeleton-row__text">
              <span className="skeleton" style={{ width: TITLE_WIDTHS[index % TITLE_WIDTHS.length] }} />
              <span className="skeleton skeleton--sub" />
            </div>
            <span className="skeleton skeleton--cat" />
            <span className="skeleton skeleton--btn" />
          </div>
        ))}
      </div>
    </>
  );
}
