# Hệ Thống Cảnh Báo Thiên Tai (DisasterWarning)

## Giới Thiệu
Hệ thống Cảnh báo Thiên tai là một giải pháp toàn diện được thiết kế để dự đoán, quản lý và cảnh báo người dùng về các hiện tượng thiên tai. Dự án được chia thành ba thành phần chính: AI, Backend và Frontend, với khả năng theo dõi người dùng thời gian thực và hiển thị vị trí trên bản đồ.

## Tính Năng Chính
1. **Theo Dõi Người Dùng Thời Gian Thực**
   - Hiển thị vị trí người dùng trên bản đồ
   - Cập nhật vị trí theo thời gian thực qua WebSocket
   - Phân tích mật độ người dùng trong khu vực
   ![Bản đồ theo dõi người dùng](/img/trackUserMap.png)

2. **Quản Lý Người Dùng**
   - Đăng ký và đăng nhập
   - Quản lý thông tin cá nhân
   - Phân quyền người dùng
   ![Trang quản lý người dùng](/img/UserManagementPage.png)

3. **Bảng Điều Khiển**
   - Hiển thị thông tin thời tiết hiện tại
   - Cảnh báo thiên tai
   - Thống kê và biểu đồ
   ![Bảng điều khiển](/img/dashboardPage.png)

4. **Quản Lý Thiên Tai**
   - Thêm và cập nhật thông tin thiên tai
   - Theo dõi diễn biến
   - Gửi cảnh báo
   ![Trang quản lý thiên tai](/img/disasterManagermentPage.png)
   ![Cập nhật thông tin thiên tai](/img/disasterManagermentPageUpdate.png)

5. **Trang Chủ và Thông Tin**
   - Giao diện thân thiện người dùng
   - Thông tin giáo dục về thiên tai
   - Hỗ trợ người dùng
   ![Trang chủ](/img/homepage.png)
   ![Thông tin giáo dục](/img/disasterInfoPageForEdu.png)
   ![Trang hỗ trợ](/img/supportPage.png)

## Cấu Trúc Dự Án
```
DisasterWarning/
├── AI/                 # Thành phần AI
│   ├── models/        # Các mô hình đã huấn luyện
│   ├── src/          # Mã nguồn AI
│   └── requirements.txt
├── BE/                 # Backend
│   ├── src/          # Mã nguồn BE
│   ├── pom.xml       # Cấu hình Maven
│   └── README.md
└── FE/                 # Frontend
    ├── src/          # Mã nguồn FE
    ├── public/       # Tài nguyên công khai
    └── package.json
```

## Hướng Dẫn Cài Đặt và Cấu Hình

### Yêu Cầu Hệ Thống
- Python 3.8 trở lên (cho AI)
- Java 11 trở lên (cho BE)
- Node.js 14 trở lên (cho FE)
- PostgreSQL

### Thiết Lập HTTPS

#### 1. Lấy Địa Chỉ IP Máy Chủ
```bash
# Linux/Ubuntu
ip a
# Windows
ipconfig
# MacOS
ifconfig
```

#### 2. Thiết Lập HTTPS cho Frontend
1. Cài đặt và tạo chứng chỉ SSL:
   ```bash
   sudo apt install mkcert
   mkcert -install
   mkcert localhost 192.168.1.86
   ```

2. Cấu hình trong `vite.config.ts`:
   ```typescript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import fs from 'fs';

   const https = {
     key: fs.readFileSync('./cert/localhost+1-key.pem'),
     cert: fs.readFileSync('./cert/localhost+1.pem'),
   };

   export default defineConfig({
     plugins: [react()],
     server: {
       https,
       host: '192.168.1.86',
       port: 3000,
     },
   });
   ```

#### 3. Thiết Lập HTTPS cho Backend
1. Tạo và chuyển đổi chứng chỉ:
   ```bash
   openssl pkcs12 -export -out keystore.p12 -inkey localhost+1-key.pem -in localhost+1.pem -name springboot
   ```

2. Cấu hình trong `application.properties`:
   ```properties
   server.port=8443
   server.ssl.key-store=classpath:keystore.p12
   server.ssl.key-store-password=your-password
   server.ssl.key-store-type=PKCS12
   server.ssl.key-alias=springboot
   ```

### Cài Đặt Các Thành Phần

1. **AI Component**
   ```bash
   cd AI
   pip install -r requirements.txt
   ```

2. **Backend**
   ```bash
   cd BE
   ./mvnw clean install
   ```

3. **Frontend**
   ```bash
   cd FE
   npm install
   ```

## Khởi Chạy Hệ Thống

1. **Khởi động Backend**
   ```bash
   cd BE
   ./mvnw spring-boot:run
   ```

2. **Khởi động Frontend**
   ```bash
   cd FE
   npm run dev
   ```

3. **Khởi động AI Service**
   ```bash
   cd AI
   python src/main.py
   ```

## Tính Năng WebSocket
- Kết nối thời gian thực giữa client và server
- Cập nhật vị trí người dùng
- Gửi cảnh báo tức thì
- Theo dõi trạng thái online/offline

## Kiểm Tra và Vận Hành
- Truy cập Frontend: `https://192.168.1.86:3000`
- Truy cập Backend: `https://192.168.1.86:8443`
- Kiểm tra API: `curl -k https://192.168.1.86:8443`

## Đóng Góp
Vui lòng tham khảo `CONTRIBUTING.md` để biết chi tiết về quy trình đóng góp.

## Giấy Phép
Dự án này được cấp phép theo giấy phép MIT.

## Liên Hệ và Hỗ Trợ
- Email: devtrantrongtri@gmail.com
- Điện thoại: (84) 332 403 656

## Về Chúng Tôi
![Về chúng tôi](/img/aboutus.png)
