import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="layout">
            <nav className="top-nav">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                    <span className="nav-icon">🏠</span>
                    Home
                </Link>
                <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>
                    <span className="nav-icon">💬</span>
                    Chat
                </Link>
                <Link to="/tasks" className={`nav-link ${location.pathname === '/tasks' ? 'active' : ''}`}>
                    <span className="nav-icon">📝</span>
                    Tasks
                </Link>
                <Link to="/quiz" className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`}>
                    <span className="nav-icon">🤔</span>
                    Quiz
                </Link>
                <Link to="/calculator" className={`nav-link ${location.pathname === '/calculator' ? 'active' : ''}`}>
                    <span className="nav-icon">🧮</span>
                    Calculator
                </Link>
                <Link to="/returns" className={`nav-link ${location.pathname === '/returns' ? 'active' : ''}`}>
                    <span className="nav-icon">📈</span>
                    Returns
                </Link>
            </nav>

            <div className="page-content">
                <aside className="article-sidebar">
                    <h3>Financial Articles</h3>
                    <ul>
                        <li><Link to="/articles/budgeting">Budgeting Basics</Link></li>
                        <li><Link to="/articles/investing">Investment Guide</Link></li>
                        <li><Link to="/articles/savings">Savings Strategies</Link></li>
                        <li><Link to="/articles/retirement">Retirement Planning</Link></li>
                    </ul>
                </aside>
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout; 
