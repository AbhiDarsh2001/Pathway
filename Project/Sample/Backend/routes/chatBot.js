// const express = require('express');
// const router = express.Router();
// const { chatWithBot, getChatHistory } = require('../controllers/chatControllers');

// // Debug middleware
// router.use((req, res, next) => {
//   console.log('ChatBot Route Hit:', {
//     method: req.method,
//     path: req.path,
//     body: req.body,
//     query: req.query
//   });
//   next();
// });

// // Chat route
// router.post('/user', async (req, res, next) => {
//   try {
//     console.log('Chat request received:', req.body);
//     await chatWithBot(req, res, next);
//   } catch (error) {
//     console.error('Chat error:', error);
//     next(error);
//   }
// });

// // History route
// router.post('/userId', async (req, res, next) => {
//   try {
//     console.log('History request received');
//     await getChatHistory(req, res, next);
//   } catch (error) {
//     console.error('History error:', error);
//     next(error);
//   }
// });

// module.exports = router;