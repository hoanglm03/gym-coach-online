# 🏋️‍♂️ Gym AI Chatbot

Chào mừng bạn đến với **Gym AI Chatbot** - Trợ lý ảo thông minh giúp bạn lên lịch tập luyện và chế độ dinh dưỡng cá nhân hóa.

## 🌟 Tính năng chính
- **Chat trực tiếp**: Hỏi đáp về kỹ thuật tập, dinh dưỡng với AI (đóng vai HLV chuyên nghiệp).
- **Tạo Lộ Trình Cá Nhân**: Nhập chỉ số cơ thể (Chiều cao, Cân nặng, Mục tiêu) để nhận ngay Lịch tập tuần + Thực đơn chi tiết.
- **Giao diện hiện đại**: Dark mode, Responsive, UX thân thiện.

## 🛠️ Công nghệ
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **AI Model**: Google Gemini 1.5 Flash

## 🚀 Hướng dẫn cài đặt & Chạy

### 1. Chuẩn bị
- Đảm bảo bạn đã cài đặt **Node.js**.
- Có **API Key** từ [Google AI Studio](https://aistudio.google.com/).

### 2. Cài đặt Backend (Server)
```bash
cd server
npm install
# Tạo file .env và thêm GEMINI_API_KEY=your_key_here
npm start
# Server chạy tại: http://localhost:3000
```

### 3. Cài đặt Frontend (Client)
```bash
cd client
npm install
npm run dev
# Mở trình duyệt: http://localhost:5173
```

## 📝 Lưu ý
- Nếu gặp lỗi kết nối API, hãy kiểm tra lại `GEMINI_API_KEY` trong `server/.env`.
- Đảm bảo cả Server và Client đều đang chạy cùng lúc.

---
*Developed by Gym AI Team* 🦾
