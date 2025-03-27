import React from 'react';
import './SideBar.css' 

const Navigation = ({ onTopicSelect }) => {
    const topics = [
        { id: 'investing', label: 'Investing Basics' },
        { id: 'budgeting', label: 'Budgeting Tips' },
        { id: 'savings', label: 'Savings Strategies' },
        { id: 'retirement', label: 'Retirement Planning' },
        { id: 'taxes', label: 'Tax Planning' },
        { id: 'debt', label: 'Debt Management' }
    ];

    return (
        <nav className="navigation">
             
            <ul className="nav-list">
                {topics.map(topic => (
                    <li key={topic.id}>
                        <button 
                            className="nav-item"
                            onClick={() => onTopicSelect(topic.label)}
                        >
                            {topic.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation; 