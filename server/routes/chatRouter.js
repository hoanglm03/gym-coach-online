const express = require('express');
const { handleChat, generatePlan } = require('../controllers/chatController');

const router = express.Router();

// GET /api/chat khi mở bằng browser → trả về hướng dẫn (chat thật dùng POST từ app client)
router.get('/chat', (req, res) => {
  res.json({ message: 'Đây là API POST. Hãy chạy app client (npm run dev trong thư mục client) và chat tại đó.' });
});
router.post('/chat', handleChat);
router.post('/plan', generatePlan);

module.exports = router;
