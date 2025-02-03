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
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// Initialize chat history with the career assistant context
const initialContext = [
    {
        role: "user",
        parts: [{
            text: "you are a career  assistent  for indian students after +2 in choosing their degree or PG or other area, so answere only which is related to career, job, courses other than that say you cannot help on other questions"
        }]
    },
    {
        role: "model",
        parts: [{
            text: "Okay, I understand. I'm here to help Indian students after their +2 (or equivalent) with career-related questions. I can assist with:\n\n*   **Choosing a bachelor's degree:** Recommendations based on interests, aptitude, and job market trends.\n*   **Postgraduate options (Master's, MBA, etc.):** Exploring further education and specializations.\n*   **Career paths:** Providing information on different career options available after specific degrees and courses.\n*   **Job market trends:** Insights into which sectors are growing and what skills are in demand.\n*   **Specific course information:** Details on syllabus, fees, and potential job opportunities related to a course.\n*   **Entrance exams:** General information about the common entrance exams for different courses in India.\n*   **Skill development:** Suggestions on skills to enhance employability.\n\n**If your question falls outside these areas, I will say \"I cannot help with that.\"**\n\nLet's begin! How can I assist you today?\n"
        }]
    }
];

let chatHistory = [...initialContext];

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

        // Keep only the last 10 messages in history (plus the initial context)
        if (chatHistory.length > 22) { // 2 initial context messages + 20 conversation messages
            chatHistory = [...initialContext, ...chatHistory.slice(-20)];
        }

        return response;
    } catch (error) {
        console.error('Error in chatWithGemini:', error);
        throw error;
    }
};

// Function to clear chat history
const clearChatHistory = () => {
    chatHistory = [...initialContext];
    return { message: 'Chat history cleared and reset to initial context' };
};

module.exports = {
    chatWithGemini,
    clearChatHistory
};