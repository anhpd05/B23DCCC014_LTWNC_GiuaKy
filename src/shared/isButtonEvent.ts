import type { MouseEvent } from 'react';

// Dùng cho cả hàng/thẻ bấm được: bấm vào nút bên trong (Mượn, Trả, tên sách...) thì để nút tự xử lý.
export function isButtonEvent(event: MouseEvent): boolean {
  return event.target instanceof Element && event.target.closest('button') !== null;
}
