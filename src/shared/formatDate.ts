import { DAY_MS } from "../constants/library";

export function formatDayMonth(timestamp: number): string {
  const date = new Date(timestamp);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function startOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

// Đếm theo ngày lịch (nửa đêm địa phương), nên không lệch khi `now` từ useNow() cũ vài giây
// và không bị DST làm chênh 1 giờ (round).
export function daysUntil(dueAt: number, now: number): number {
  return Math.max(0, Math.round((startOfDay(dueAt) - startOfDay(now)) / DAY_MS));
}

export function formatIsbn(isbn: string): string {
  return isbn.replace(/^(\d{3})(\d)(\d{3})(\d{5})(\d)$/, "$1-$2-$3-$4-$5");
}
