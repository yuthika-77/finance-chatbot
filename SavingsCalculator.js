import React, { useState } from 'react';
import './SavingsCalculator.css';

function SavingsCalculator() {
    const [salary, setSalary] = useState(50000);
    const [expenses, setExpenses] = useState(30000);
    const [productCost, setProductCost] = useState(100000);
    const [months, setMonths] = useState('---');
    const [suggestions, setSuggestions] = useState('');

    const calculateSavings = () => {
        const savingsPerMonth = salary - expenses;
        
        if (savingsPerMonth <= 0) {
            setMonths("Never (Try cutting expenses!)");
            setSuggestions(
                "<b>Suggestions:</b><ul>" +
                "<li>Reduce unnecessary subscriptions</li>" +
                "<li>Cook at home instead of eating out</li>" +
                "<li>Use public transport instead of cabs</li>" +
                "<li>Track spending using budgeting apps</li>" +
                "</ul>"
            );
            return;
        }

        const monthsNeeded = Math.ceil(productCost / savingsPerMonth);
        setMonths(monthsNeeded);

        let newSuggestions = "";
        if (monthsNeeded > 12) {
            newSuggestions = "<b>Suggestions:</b><ul>" +
                "<li>Consider reducing entertainment expenses</li>" +
                "<li>Negotiate lower rent or utility bills</li>" +
                "<li>Invest a portion of your savings for faster growth</li>" +
                "<li>Avoid impulse purchases</li>" +
                "</ul>";
        }
        setSuggestions(newSuggestions);
    };

    return (
        <div className="calculator-container">
            <h2>Savings Goal Calculator</h2>

            <div className="input-group">
                <label>Monthly Salary (₹):</label>
                <input 
                    type="number" 
                    value={salary}
                    onChange={(e) => setSalary(parseFloat(e.target.value))}
                    min="0"
                />
            </div>

            <div className="input-group">
                <label>Monthly Expenses (₹):</label>
                <input 
                    type="number" 
                    value={expenses}
                    onChange={(e) => setExpenses(parseFloat(e.target.value))}
                    min="0"
                />
            </div>

            <div className="input-group">
                <label>Product Cost (₹):</label>
                <input 
                    type="number" 
                    value={productCost}
                    onChange={(e) => setProductCost(parseFloat(e.target.value))}
                    min="0"
                />
            </div>

            <button onClick={calculateSavings}>Calculate</button>

            <h3>You can buy it in: <span>{months}</span> months</h3>
            <div className="suggestions" dangerouslySetInnerHTML={{ __html: suggestions }}></div>
        </div>
    );
}

export default SavingsCalculator; 