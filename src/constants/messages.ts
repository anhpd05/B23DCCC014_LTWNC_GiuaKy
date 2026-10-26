import { MAX_BORROW } from "./library";

export type NoticeCode = "BORROW_LIMIT_EXCEEDED" | "REQUEST_FAILED";

// Redux state chỉ giữ mã câu chữ hiển thị tra ở đây.
export const NOTICE_MESSAGES: Record<NoticeCode, string> = {
  BORROW_LIMIT_EXCEEDED: `Bạn chỉ được mượn tối đa ${MAX_BORROW} cuốn cùng lúc`,
  REQUEST_FAILED: "Thao tác không thành công. Vui lòng thử lại.",
};
