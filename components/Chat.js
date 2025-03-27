import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { 
            text: userMessage, 
            sender: 'user',
            timestamp: new Date().toISOString()
        }]);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Add the main message
            setMessages(prev => [...prev, { 
                text: data.message, 
                sender: 'bot',
                timestamp: data.timestamp
            }]);
            
            // Add suggestions if available
            if (data.suggestions) {
                data.suggestions.forEach(suggestion => {
                    setMessages(prev => [...prev, { 
                        text: suggestion, 
                        sender: 'bot', 
                        isSuggestion: true,
                        timestamp: new Date().toISOString()
                    }]);
                });
            }
            
            // Add disclaimer if available
            if (data.disclaimer) {
                setMessages(prev => [...prev, { 
                    text: data.disclaimer, 
                    sender: 'bot', 
                    isDisclaimer: true,
                    timestamp: new Date().toISOString()
                }]);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                text: "I'm having trouble connecting right now. Please try again in a moment.", 
                sender: 'bot',
                isError: true,
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-page">
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div 
                            key={`${message.timestamp}-${index}`}
                            className={`message ${message.sender} ${message.isSuggestion ? 'suggestion' : ''} ${message.isDisclaimer ? 'disclaimer' : ''} ${message.isError ? 'error' : ''}`}
                        >
                            {message.text}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message bot loading">
                            <span className="loading-dots">...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="input-form">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me about finance..."
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>
                        Send
                    </button>
                </form>
                <div className="disclaimer">
                    This is general financial information and not personalized financial advice. 
                    Please consult with a qualified financial advisor for specific recommendations.
                </div>
            </div>
            <nav className="main-nav">
                <Link to="/" className="nav-link">
                    <span className="nav-icon">🏠</span>
                    Home
                </Link>
                <Link to="/chat" className="nav-link active">
                    <span className="nav-icon">💬</span>
                    Chat
                </Link>
                <Link to="/quiz" className="nav-link">
                    <span className="nav-icon">📝</span>
                    Quiz
                </Link>
            </nav>
        </div>
    );
};

export default Chat; 
