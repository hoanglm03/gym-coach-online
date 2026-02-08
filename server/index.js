const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const chatRoutes = require('./routes/chatRouter');

// Giữ process sống và log lỗi nếu có (tránh server thoát im lặng)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const port = process.env.PORT || 3000;

// CORS rõ ràng cho client dev (localhost:5173)
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(bodyParser.json());

app.get('/api', (req, res) => {
  res.json({ ok: true, message: 'Gym AI API. Dùng app client để chat, không mở /api/chat trực tiếp trên browser.' });
});
app.get('/api/health', (req, res) => {
  res.json({ ok: true, server: 'running' });
});
app.use('/api', chatRoutes);

app.get('/', (req, res) => {
  res.send('Gym AI Chatbot Server is running!');
});

// Export app for Vercel
module.exports = app;

// Only listen if run directly (node index.js)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
