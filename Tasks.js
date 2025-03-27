import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Tasks.css';

const financeQuestions = [
    {
        question: "What is a 401(k)?",
        options: [
            "A retirement savings plan sponsored by an employer",
            "A type of investment fund",
            "A government bond",
            "A savings account"
        ],
        correctAnswer: 0,
        video: "https://www.youtube.com/embed/your-video-id-1"
    },
    {
        question: "What is compound interest?",
        options: [
            "Interest on your savings account",
            "Interest earned on both principal and previously earned interest",
            "Interest paid on loans",
            "A type of investment"
        ],
        correctAnswer: 1,
        video: "https://www.youtube.com/embed/your-video-id-2"
    },
    {
        question: "What is diversification in investing?",
        options: [
            "Putting all money in one stock",
            "Spreading investments across different assets",
            "Saving money in a bank",
            "Trading stocks frequently"
        ],
        correctAnswer: 1,
        video: "https://www.youtube.com/embed/your-video-id-3"
    },
    {
        question: "What is a stock market index?",
        options: [
            "A type of stock",
            "A measure of stock market performance",
            "A trading platform",
            "A financial advisor"
        ],
        correctAnswer: 1,
        video: "https://www.youtube.com/embed/your-video-id-4"
    },
    {
        question: "What is inflation?",
        options: [
            "A type of investment",
            "A decrease in prices",
            "A general increase in prices",
            "A type of tax"
        ],
        correctAnswer: 2,
        video: "https://www.youtube.com/embed/your-video-id-5"
    }
];

const Tasks = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [unlockedVideos, setUnlockedVideos] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const handleAnswerClick = (optionIndex) => {
        setSelectedAnswer(optionIndex);
        
        if (optionIndex === financeQuestions[currentQuestion].correctAnswer) {
            setScore(score + 1);
            setUnlockedVideos([...unlockedVideos, currentQuestion]);
            
            if (currentQuestion < financeQuestions.length - 1) {
                setTimeout(() => {
                    setCurrentQuestion(currentQuestion + 1);
                    setSelectedAnswer(null);
                }, 1000);
            } else {
                setShowScore(true);
            }
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer(null);
    };

    return (
        <div className="tasks-page">
            <div className="tasks-container">
                {showScore ? (
                    <div className="score-section">
                        <h2>Quiz Complete!</h2>
                        <p>You scored {score} out of {financeQuestions.length}</p>
                        <button onClick={resetQuiz}>Retry Quiz</button>
                    </div>
                ) : (
                    <div className="quiz-section">
                        <div className="question-section">
                            <h2>Question {currentQuestion + 1} of {financeQuestions.length}</h2>
                            <p>{financeQuestions[currentQuestion].question}</p>
                        </div>
                        <div className="answer-section">
                            {financeQuestions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerClick(index)}
                                    className={`answer-button ${
                                        selectedAnswer === index
                                            ? index === financeQuestions[currentQuestion].correctAnswer
                                                ? 'correct'
                                                : 'incorrect'
                                            : ''
                                    }`}
                                    disabled={selectedAnswer !== null}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="videos-section">
                    <h2>Unlocked Videos</h2>
                    <div className="videos-grid">
                        {financeQuestions.map((q, index) => (
                            <div key={index} className="video-card">
                                {unlockedVideos.includes(index) ? (
                                    <iframe
                                        src={q.video}
                                        title={`Finance Video ${index + 1}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="locked-video">
                                        <span>🔒</span>
                                        <p>Complete question {index + 1} to unlock</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <nav className="main-nav">
                <Link to="/" className="nav-link">
                    <span className="nav-icon">🏠</span>
                    Home
                </Link>
                <Link to="/chat" className="nav-link">
                    <span className="nav-icon">💬</span>
                    Chat
                </Link>
                <Link to="/tasks" className="nav-link active">
                    <span className="nav-icon">📝</span>
                    Tasks
                </Link>
            </nav>
        </div>
    );
};

export default Tasks; 