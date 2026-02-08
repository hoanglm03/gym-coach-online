const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GYM_COACH_SYSTEM_PROMPT, PLAN_GENERATION_PROMPT } = require("../utils/promptTemplates");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction: GYM_COACH_SYSTEM_PROMPT,
});

// ... (chatSessions definition)

const handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ response: "Vui lòng nhập tin nhắn." });
        }

        // 1. Convert to Gemini format
        let formattedHistory = [];
        if (history && history.length > 0) {
            formattedHistory = history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));
        }

        // 2. Sanitation: Merge consecutive messages from same role
        let sanitizedHistory = [];
        for (const item of formattedHistory) {
            if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === item.role) {
                sanitizedHistory[sanitizedHistory.length - 1].parts[0].text += "\n" + item.parts[0].text;
            } else {
                sanitizedHistory.push(item);
            }
        }

        // 3. Ensure history starts with 'user'
        if (sanitizedHistory.length > 0 && sanitizedHistory[0].role !== 'user') {
            sanitizedHistory.shift();
        }

        // 4. Handle "last message was user" case
        let currentMessage = message;
        if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === 'user') {
            const lastUserMsg = sanitizedHistory.pop();
            currentMessage = lastUserMsg.parts[0].text + "\n" + message;
        }

        console.log("Starts creating chat session...");
        const geminiChatSession = model.startChat({
            history: sanitizedHistory,
            // systemInstruction is now at model level
        });

        console.log("Sending message to Gemini...");
        const result = await geminiChatSession.sendMessage(currentMessage);
        const response = await result.response;
        const text = response.text();
        console.log("Received response from Gemini.");

        res.json({ response: text });
    } catch (error) {
        console.error("Error generating AI response:", error);
        const msg = (error && (error.message || String(error))) || "Lỗi không xác định";
        res.status(500).json({
            response: "Lỗi Gemini: " + msg + " (kiểm tra API Key tại server/.env và tên model gemini-3-flash-preview)."
        });
    }
};

const generatePlan = async (req, res) => {
    try {
        const { age, gender, height, weight, goal, daysPerWeek } = req.body;

        let prompt = PLAN_GENERATION_PROMPT
            .replace('{age}', age)
            .replace('{gender}', gender)
            .replace('{height}', height)
            .replace('{weight}', weight)
            .replace('{goal}', goal)
            .replace('{daysPerWeek}', daysPerWeek);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ plan: text });
    } catch (error) {
        console.error("Error generating plan:", error);
        res.status(500).json({ error: "Failed to generate plan" });
    }
}

module.exports = { handleChat, generatePlan };
