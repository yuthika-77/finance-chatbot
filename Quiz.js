import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const quizData = [
        {
            question: "What is the full form of SIP?",
            options: ["Systematic Investment Plan", "Savings in Portfolio", "Secure Investment Plan", "Stock Interest Portfolio"],
            correct: 0
        },
        {
            question: "What does NAV stand for in mutual funds?",
            options: ["Net Asset Value", "National Asset Volume", "Non-Accountable Value", "Newly Added Venture"],
            correct: 0
        },
        {
            question: "Which of these is a tax-saving investment?",
            options: ["Fixed Deposit", "Public Provident Fund (PPF)", "Recurring Deposit", "Savings Account"],
            correct: 1
        }
    ];

    const loadQuestion = () => {
        setShowResult(false);
    };

    const checkAnswer = (selectedIndex) => {
        if (selectedIndex === quizData[currentQuestionIndex].correct) {
            setShowResult(true);
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
                loadQuestion();
            }, 1000);
        } else {
            alert("❌ Wrong answer! Try again.");
        }
    };

    useEffect(() => {
        loadQuestion();
    }, []);

    return (
        <div className="quiz-container">
            <h1>💰 FinWise Quiz 💰</h1>
            <p className="question">
                {currentQuestionIndex >= quizData.length 
                    ? "🎉 Quiz Completed! Well done!" 
                    : quizData[currentQuestionIndex].question}
            </p>
            <div className="options-container">
                {currentQuestionIndex < quizData.length && 
                    quizData[currentQuestionIndex].options.map((option, index) => (
                        <button
                            key={index}
                            className="option"
                            onClick={() => checkAnswer(index)}
                        >
                            {option}
                        </button>
                    ))
                }
            </div>
            <p className={`result ${showResult ? '' : 'hidden'}`}>
                ✅ Correct! Proceeding...
            </p>
        </div>
    );
};

export default Quiz; 