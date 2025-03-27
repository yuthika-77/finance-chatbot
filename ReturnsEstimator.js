import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ReturnsEstimator.css';

function ReturnsEstimator() {
    const [investmentAmount, setInvestmentAmount] = useState(5000);
    const [duration, setDuration] = useState(22);
    const [rate, setRate] = useState(12);
    const [isSIP, setIsSIP] = useState(true);
    const [yearlyData, setYearlyData] = useState([]);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Invested Amount', 'Est. Returns'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#00ffcc', '#ff00cc']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#00ffcc',
                            font: {
                                family: "'Press Start 2P', cursive",
                                size: 8
                            }
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        calculateReturns();
    }, [investmentAmount, duration, rate, isSIP]);

    const calculateReturns = () => {
        const principal = parseFloat(investmentAmount);
        const years = parseInt(duration);
        const rateDecimal = parseFloat(rate) / 100;
        let newYearlyData = [];

        if (isSIP) {
            let invested = 0, total = 0;
            for (let i = 1; i <= years; i++) {
                invested += principal * 12;
                total = total * (1 + rateDecimal) + principal * 12 * (1 + rateDecimal);
                let returns = total - invested;
                newYearlyData.push({ year: i, invested, returns, total });
            }
        } else {
            let totalInvested = principal;
            for (let i = 1; i <= years; i++) {
                let futureValue = principal * Math.pow(1 + rateDecimal, i);
                let returns = futureValue - totalInvested;
                newYearlyData.push({ year: i, invested: totalInvested, returns, total: futureValue });
            }
        }

        setYearlyData(newYearlyData);
        if (chartInstance.current) {
            const lastYear = newYearlyData[newYearlyData.length - 1];
            chartInstance.current.data.datasets[0].data = [lastYear.invested, lastYear.returns];
            chartInstance.current.update();
        }
    };

    const toggleInvestmentType = (type) => {
        setIsSIP(type === 'sip');
    };

    return (
        <div className="estimator-container">
            <h2>Returns Estimator</h2>
            <p className="subtitle">Estimation based on past performance</p>

            <div className="input-group">
                <label>Enter Amount (₹)</label>
                <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(parseFloat(e.target.value))}
                    min="0"
                />
            </div>

            <div className="toggle-group">
                <button
                    className={`toggle-btn ${isSIP ? 'active' : ''}`}
                    onClick={() => toggleInvestmentType('sip')}
                >
                    SIP
                </button>
                <button
                    className={`toggle-btn ${!isSIP ? 'active' : ''}`}
                    onClick={() => toggleInvestmentType('lumpsum')}
                >
                    Lumpsum
                </button>
            </div>

            <div className="input-group">
                <label>Select Duration (Years)</label>
                <input
                    type="range"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    min="1"
                    max="30"
                />
                <span className="value-display">{duration} Years</span>
            </div>

            <div className="input-group">
                <label>Expected Rate of Return (%)</label>
                <input
                    type="range"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    min="8"
                    max="30"
                />
                <span className="value-display">{rate}%</span>
            </div>

            <div className="result-display">
                <p>Total Value after {duration} Years:</p>
                <h3>₹ {yearlyData[yearlyData.length - 1]?.total.toLocaleString('en-IN') || '0'}</h3>
            </div>

            <div className="chart-container">
                <canvas ref={chartRef}></canvas>
            </div>

            <div className="table-container">
                <h3>Yearly Growth Breakdown</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Invested (₹)</th>
                            <th>Returns (₹)</th>
                            <th>Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {yearlyData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.year}</td>
                                <td>{data.invested.toLocaleString('en-IN')}</td>
                                <td className="returns">{data.returns.toLocaleString('en-IN')}</td>
                                <td className="total">{data.total.toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ReturnsEstimator; 