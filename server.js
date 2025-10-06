const PORT = process.env.PORT || 5000;
const express = require("express");
const cors = require("cors");
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
// Serve static HTML/asset files from the project root
app.use(express.static(__dirname));

// Define the finance expert system prompt
const FINANCE_SYSTEM_PROMPT = `You are an expert financial advisor chatbot. Your role is to:
- Provide clear, accurate financial advice and information
- Explain complex financial concepts in simple terms
- Help with personal finance, investing, budgeting, and financial planning
- Always include disclaimers when giving investment advice
- Never make specific stock predictions or guarantees about investment returns
- Avoid real-time market claims. If asked, advise verifying with up-to-date sources.

Remember: Always maintain professional ethics and remind users that this is general advice, not personalized financial recommendations.`;

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyAe6IC0IRapBUf84m1e1MRmE7sPty3ZOjc';
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const chat = model.startChat({
            systemInstruction: FINANCE_SYSTEM_PROMPT,
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                maxOutputTokens: 1024
            }
        });

        let text;
        try {
            const result = await chat.sendMessage(message);
            const resp = await result.response;
            text = resp.text();
        } catch (e) {
            console.warn('Gemini SDK failed, using fallback:', e?.message);
            text = generateHelpfulFallback(message);
        }

        const payload = {
            message: text,
            timestamp: new Date().toISOString(),
            disclaimer: "This is general financial information and not personalized financial advice. Please consult a qualified financial advisor for specific recommendations."
        };

        console.log("Finance Bot Response:", text);
        return res.json(payload);
    } catch (error) {
        console.error("Gemini Error:", error?.response?.data || error.message);
        const status = error?.response?.status || 500;
        const apiStatus = error?.response?.data?.error?.status;

        if (status === 401 || apiStatus === 'PERMISSION_DENIED' || apiStatus === 'NOT_FOUND') {
            return res.json({
                message: generateHelpfulFallback(req.body?.message || ''),
                timestamp: new Date().toISOString(),
                disclaimer: "This is general financial information and not personalized financial advice. Please consult a qualified financial advisor for specific recommendations.",
                note: "Gemini API unavailable; returned a helpful fallback response."
            });
        }

        return res.status(500).json({ 
            error: "Something went wrong", 
            details: error?.response?.data || error.message 
        });
    }
});

function generateHelpfulFallback(userMessage) {
    const msg = (userMessage || '').toLowerCase();
    if (/(emergency|rainy day|buffer)/.test(msg)) {
        return [
            'Emergency fund plan: 3–6 months of essential expenses. Automate a small transfer after payday, keep funds in a high‑yield savings account, and refill after any use.'
        ][0];
    }
    if (/(budget|50\/30\/20|spend|save)/.test(msg)) {
        return '50/30/20 budget: 50% needs, 30% wants, 20% saving/debt. Track 2 weeks of spending, auto‑save on payday, and review monthly to rebalance.';
    }
    if (/(invest|mutual fund|sip|stocks|returns)/.test(msg)) {
        return 'Starter investing: build an emergency fund first, then begin SIPs in broad‑market index funds. Use a risk‑appropriate mix and review annually; avoid timing the market.';
    }
    if (/(debt|loan|credit card)/.test(msg)) {
        return 'Debt payoff: list balances and APRs, pick avalanche (highest APR first) or snowball (smallest balance first), automate extra payments, and avoid new high‑APR debt.';
    }
    if (/(credit score|cibil|fico)/.test(msg)) {
        return 'Credit score tips: pay on time (set autopay), keep utilization <30% (prefer <10%), avoid frequent hard inquiries, and keep your oldest account open.';
    }
    if (/(retire|goal|save)/.test(msg)) {
        return 'Goal planning: define amount × date, auto‑save monthly, increase by 1–2% each quarter, and invest long‑term funds per risk tolerance to beat inflation.';
    }
    return 'How can I help with your finances today? Share your goal, timeline, and risk comfort; I’ll outline steps and a simple plan you can start this week.';
}

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "finance-chatbot" });
});

// Serve the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Finance Chatbot Server running on PORT ${PORT}`);
});