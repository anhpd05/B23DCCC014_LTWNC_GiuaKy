import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { NOTICE_AUTO_HIDE_MS } from '../../../constants/library';
import { NOTICE_MESSAGES } from '../../../constants/messages';
import { clearWarning } from '../booksSlice';
import { selectBooksWarning } from '../selectors';

export function NoticeBanner() {
  const dispatch = useAppDispatch();
  const warning = useAppSelector(selectBooksWarning);

  useEffect(() => {
    if (!warning) return;
    const timer = setTimeout(() => dispatch(clearWarning()), NOTICE_AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [warning, dispatch]);

  if (!warning) return null;

  return (
    <div className="notice" role="alert">
      <span>{NOTICE_MESSAGES[warning]}</span>
      <button type="button" className="notice__close" aria-label="Đóng" onClick={() => dispatch(clearWarning())}>
        ×
      </button>
    </div>
  );
}
