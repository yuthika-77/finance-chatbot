const PORT = 5000;
const express = require("express");
const cors = require("cors");
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Define the finance expert system prompt
const FINANCE_SYSTEM_PROMPT = `You are an expert financial advisor chatbot. Your role is to:
- Provide clear, accurate financial advice and information
- Explain complex financial concepts in simple terms
- Help with personal finance, investing, budgeting, and financial planning
- Always include disclaimers when giving investment advice
- Never make specific stock predictions or guarantees about investment returns
- Stay up-to-date with general market knowledge but avoid real-time market data
- If asked about specific numbers or current market data, remind users to verify current information

Remember: Always maintain professional ethics and remind users that this is general advice, not personalized financial recommendations.`;

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Using Hugging Face's free API
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
            {
                inputs: `<s>[INST] ${FINANCE_SYSTEM_PROMPT}\n\nUser: ${message} [/INST]`,
                parameters: {
                    max_new_tokens: 1024,
                    temperature: 0.7,
                    top_p: 0.95,
                    return_full_text: false
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract the actual response from the model output
        let responseText = response.data[0].generated_text;
        
        // Clean up the response by removing the system prompt and user message
        responseText = responseText.replace(FINANCE_SYSTEM_PROMPT, '').trim();
        responseText = responseText.replace(`User: ${message}`, '').trim();
        
        // Remove any remaining special tokens
        responseText = responseText.replace(/<s>|<\/s>|\[INST\]|\[\/INST\]/g, '').trim();

        console.log("Finance Bot Response:", responseText);
        res.json({ 
            response: responseText,
            disclaimer: "This is general financial information and not personalized financial advice. Please consult with a qualified financial advisor for specific recommendations."
        });

    } catch (error) {
        console.error("Error:", error);
        if (error.response?.status === 401) {
            return res.status(401).json({ 
                error: "Invalid API key. Please check your Hugging Face API key in the .env file.",
                details: error.message 
            });
        }
        res.status(500).json({ 
            error: "Something went wrong", 
            details: error.message 
        });
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "finance-chatbot" });
});

// Add a route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Finance Chatbot Server running on PORT ${PORT}`);
});