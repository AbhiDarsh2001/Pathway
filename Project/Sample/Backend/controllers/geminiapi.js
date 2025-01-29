const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
}

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
});

const generationConfig = {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
};

// Initialize chat history
let chatHistory = [];

const chatWithGemini = async (message) => {
    try {
        const chat = model.startChat({
            generationConfig,
            history: chatHistory,
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        // Update chat history
        chatHistory.push(
            { role: "user", parts: [{ text: message }] },
            { role: "model", parts: [{ text: response }] }
        );

        // Keep only the last 10 messages in history
        if (chatHistory.length > 20) {
            chatHistory = chatHistory.slice(-20);
        }

        return response; 
    } catch (error) {
        console.error('Error in chatWithGemini:', error);
        throw error;
    }
};

// Function to clear chat history
const clearChatHistory = () => {
    chatHistory = [];
    return { message: 'Chat history cleared' };
};

module.exports = {
    chatWithGemini,
    clearChatHistory
};