import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path'; // Thêm path để hỗ trợ alias nếu cần

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'sockjs-client': path.resolve(__dirname, 'node_modules/sockjs-client/dist/sockjs.min.js'),
    },
  },
  server: {
    host: true, // Cho phép truy cập từ mạng ngoài nếu cần
    https: {
      key: './certs/localhost+1-key.pem', // Đường dẫn tới khóa riêng
      cert: './certs/localhost+1.pem',   // Đường dẫn tới chứng chỉ
    },
    port: 5173, // Tùy chọn: Thay đổi cổng nếu muốn
  },
});
