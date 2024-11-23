
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { notification } from 'antd';

// Type guard để kiểm tra FetchBaseQueryError
export function isFetchBaseQueryError(
  error: FetchBaseQueryError | SerializedError
): error is FetchBaseQueryError {
  return (error as FetchBaseQueryError).status !== undefined;
}

// Type guard để kiểm tra SerializedError
export function isSerializedError(
  error: FetchBaseQueryError | SerializedError
): error is SerializedError {
  return (error as SerializedError).message !== undefined;
}

// Type guard để kiểm tra xem data có chứa thuộc tính message hay không
export function hasMessage(data: unknown): data is { message: string } {
  return typeof data === 'object' && data !== null && 'message' in data;
}

// Hàm hiển thị thông báo lỗi
export function displayErrorNotification(error: FetchBaseQueryError | SerializedError | undefined) {
  notification.error({
    message: 'Đăng ký thất bại',
    description:
      error && isFetchBaseQueryError(error) && error.data && hasMessage(error.data)
        ? error.data.message
        : error && isSerializedError(error) && error.message
        ? error.message
        : 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.',
    duration: 3,
  });
}
