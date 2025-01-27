// const ChatMessage = require('../models/chatModel');
// const OpenAI = require('openai');

// // Initialize OpenAI with your API key
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Add rate limiting variables
// let lastRequestTime = 0;
// const MIN_REQUEST_INTERVAL = 1000; // 1 second minimum between requests

// // The system message that sets the context for the medical chatbot
// const SYSTEM_MESSAGE = `You are a helpful medical assistant chatbot. 
// You can provide general health information and guidance, but always remind users 
// to consult healthcare professionals for specific medical advice. 
// Never provide diagnoses or prescribe medications.`;

// const chatWithBot = async (req, res) => {
//   try {
//     // Implement basic rate limiting
//     const now = Date.now();
//     if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
//       return res.status(429).json({
//         success: false,
//         message: 'Please wait a moment before sending another message'
//       });
//     }
//     lastRequestTime = now;

//     const { message } = req.body;
//     console.log("Received chat message:", message);

//     // Generate response using OpenAI
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: SYSTEM_MESSAGE },
//         { role: "user", content: message }
//       ],
//       max_tokens: 150,
//       temperature: 0.7,
//     });

//     if (!completion.choices || completion.choices.length === 0) {
//       throw new Error('No response from OpenAI');
//     }

//     const botResponse = completion.choices[0].message.content;

//     // Save the conversation to database
//     const chatMessage = new ChatMessage({
//       message,
//       response: botResponse,
//       timestamp: new Date()
//     });
//     console.log("Chatgpt response",chatMessage);
//     await chatMessage.save()
    

//     res.status(200).json({ 
//       success: true, 
//       response: botResponse 
//     });

//   } catch (error) {
//     console.error('Chat error:', error);
    
//     if (error.response?.status === 429 || error.error?.type === 'insufficient_quota') {
//       return res.status(429).json({
//         success: false,
//         message: 'Service is temporarily unavailable. Please try again in a moment.'
//       });
//     }
    
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error processing your request. Please try again.' 
//     });
//   }
// };

// const getChatHistory = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     console.log("Hitted in the chathistory", userId);
    
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not authenticated'
//       });
//     }

//     const history = await ChatMessage.find({ userId })
//       .sort({ timestamp: -1 })
//       .limit(50);

//     res.status(201).json({ 
//       success: true, 
//       history 
//     });
//   } catch (error) {
//     console.error('History error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message || 'Error fetching chat history' 
//     });
//   }
// };

// module.exports = {
//   chatWithBot,
//   getChatHistory
// };