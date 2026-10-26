import { MAX_BORROW } from "./library";

export type NoticeCode = "BORROW_LIMIT_EXCEEDED" | "REQUEST_FAILED";

export const NOTICE_MESSAGES: Record<NoticeCode, string> = {
  BORROW_LIMIT_EXCEEDED: `Bạn đã mượn đủ ${MAX_BORROW} cuốn. Hãy trả bớt 1 cuốn trước khi mượn thêm.`,
  REQUEST_FAILED: "Thao tác không thành công. Vui lòng thử lại.",
};

export const TOAST_MESSAGES = {
  borrowed: (title: string, due: string) =>
    `Đã mượn “${title}” · hạn trả ${due}`,
  returned: (title: string) => `Đã trả “${title}”`,
  limitReached: `Không thể mượn thêm — đã đủ ${MAX_BORROW} cuốn`,
  notifyOn: "Sẽ thông báo khi sách được trả lại",
};
