import { useEffect } from 'react';
import { TOAST_MS } from '../../constants/library';
import { useToastStore } from './toastStore';

export function ToastHost() {
  const toast = useToastStore((state) => state.toast);
  const hide = useToastStore((state) => state.hide);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(hide, TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast, hide]);

  return (
    <div className="toast-host" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className="toast">
          <span className="toast__dot" data-kind={toast.kind} aria-hidden="true" />
          <span className="toast__msg">{toast.message}</span>
          {toast.onUndo && (
            <button
              type="button"
              className="toast__undo"
              onClick={() => {
                toast.onUndo?.();
                hide();
              }}
            >
              Hoàn tác
            </button>
          )}
        </div>
      )}
    </div>
  );
}
