import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
    const [data, setData] = useState({ has_data: false });
    const [loading, setLoading] = useState(true);
    const [healthOutput, setHealthOutput] = useState('');
    const [forecastOutput, setForecastOutput] = useState('');

    const token = localStorage.getItem('token');
    const api = useMemo(() => axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: { Authorization: `Bearer ${token}` }
    }), [token]);

    const loadData = useCallback(async () => {
        try {
            const res = await api.get('/dashboard');
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        if (token) loadData();
    }, [token, loadData]);

    const handleUpload = async (e) => {
        e.preventDefault();
        const file = e.target.file.files[0];
        const formData = new FormData();
        formData.append('file', file);
        try {
            await api.post('/upload', formData);
            loadData();
            alert('Upload success!');
        } catch (err) {
            alert('Upload failed: ' + err.message);
        }
    };

    const handleManual = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const body = Object.fromEntries(formData.entries());
        try {
            await api.post('/transactions/manual', body);
            loadData();
            e.target.reset();
        } catch (err) {
            alert('Add failed: ' + err.message);
        }
    };

    const handleBudget = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            await api.post('/budgets', Object.fromEntries(formData.entries()));
            loadData();
        } catch (err) { }
    };

    const handleGoal = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            await api.post('/goals', Object.fromEntries(formData.entries()));
            loadData();
        } catch (err) { }
    };

    const handleHealth = async () => {
        try {
            const res = await api.get('/health');
            setHealthOutput(`Score: ${res.data.score}. ${res.data.details}`);
        } catch (err) { }
    };

    const handleForecast = async () => {
        try {
            const res = await api.get('/forecast');
            setForecastOutput(`Next Month Total: ₹${res.data.next_month_total?.toFixed(2) || 0} (${res.data.message})`);
        } catch (err) { }
    };

    const handleChat = async (e) => {
        e.preventDefault();
        const msg = e.target.elements.chatInput.value;
        try {
            const res = await api.post('/chat', { message: msg });
            const log = document.getElementById('chat-log');
            log.innerHTML += `<div style="margin-bottom: 8px;"><strong>You:</strong> ${msg}</div>`;
            log.innerHTML += `<div style="margin-bottom: 16px; color: #0369a1;"><strong>AI:</strong> ${res.data.reply}</div>`;
            e.target.reset();
        } catch (err) { }
    };

    if (loading) return <div>Loading dashboard...</div>;

    // Chart Data Preparation
    const pieData = {
        labels: data.by_category?.map(c => c.category) || [],
        datasets: [{
            data: data.by_category?.map(c => c.abs_amount) || [],
            backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'],
        }]
    };

    const lineData = {
        labels: data.income_vs_expenses?.map(d => d.month.substring(0,7)) || [],
        datasets: [
            { label: 'Income', data: data.income_vs_expenses?.map(d => d.income) || [], borderColor: '#22c55e', backgroundColor: '#22c55e' },
            { label: 'Expenses', data: data.income_vs_expenses?.map(d => d.expenses) || [], borderColor: '#ef4444', backgroundColor: '#ef4444' }
        ]
    };

    return (
        <section className="dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {!data.has_data && (
                <div style={styles.card}>
                    <h1 style={styles.title}>Welcome to your Personal Finance Analyzer</h1>
                    <p style={styles.muted}>Start by uploading a bank statement (CSV or Excel) or adding a few transactions manually.</p>
                </div>
            )}

            <div style={styles.grid2}>
                <div style={styles.card}>
                    <h2 style={styles.h2}>Upload Transactions</h2>
                    <form onSubmit={handleUpload} style={styles.formContainer}>
                        <input type="file" name="file" accept=".csv,.xlsx,.xls" required style={styles.input}/>
                        <button type="submit" style={styles.btn}>Upload Statement</button>
                    </form>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.h2}>Manual Transaction</h2>
                    <form onSubmit={handleManual} style={styles.formContainer}>
                        <input type="date" name="date" required style={styles.input}/>
                        <input type="text" name="description" placeholder="Description" required style={styles.input}/>
                        <input type="number" step="0.01" name="amount" placeholder="Amount" required style={styles.input}/>
                        <select name="type" style={styles.input}>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                        <button type="submit" style={styles.btn}>Add Transaction</button>
                    </form>
                </div>
            </div>

            <div style={styles.grid2}>
                <div style={styles.card}>
                    <h2 style={styles.h2}>Budgets</h2>
                    <form onSubmit={handleBudget} style={{...styles.formContainer, flexDirection: 'row'}}>
                        <select name="category" style={styles.input}>
                            <option>Food and Dining</option>
                            <option>Transportation</option>
                            <option>Shopping</option>
                            <option>Bills and Utilities</option>
                            <option>Entertainment</option>
                            <option>Healthcare</option>
                            <option>Investments</option>
                            <option>Others</option>
                        </select>
                        <input type="number" step="0.01" name="limit" placeholder="Limit ₹" required style={styles.input}/>
                        <button type="submit" style={styles.btn}>Save</button>
                    </form>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                        {data.budget_status?.map((b, i) => (
                            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
                                <span>{b.category}</span>
                                <span>₹{b.spent.toFixed(2)} / ₹{b.limit.toFixed(2)}</span>
                                <span style={{ color: b.status === 'OK' ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>{b.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.h2}>Savings Goals</h2>
                    <form onSubmit={handleGoal} style={styles.formContainer}>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                            <input type="text" name="name" placeholder="Name" required style={styles.input}/>
                            <input type="number" step="0.01" name="target" placeholder="Target ₹" required style={styles.input}/>
                        </div>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                            <input type="number" step="0.01" name="current" placeholder="Current ₹" defaultValue="0" style={styles.input}/>
                            <input type="date" name="deadline" style={styles.input}/>
                        </div>
                        <button type="submit" style={styles.btn}>Add Goal</button>
                    </form>
                    <div style={{ marginTop: '1rem' }}>
                        {data.goals?.map((g, i) => (
                            <div key={i} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <strong>{g.name}</strong>
                                    <span style={styles.muted}>{g.deadline ? `by ${g.deadline}` : ''}</span>
                                </div>
                                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${g.progress}%`, backgroundColor: '#3b82f6' }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                    <span>₹{g.current.toFixed(2)} / ₹{g.target.toFixed(2)}</span>
                                    <span>{g.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {data.has_data && (
                <div style={styles.grid2}>
                    <div style={styles.card}>
                        <h2 style={styles.h2}>Expense Distribution</h2>
                        <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                    <div style={styles.card}>
                        <h2 style={styles.h2}>Income vs Expenses</h2>
                         <div style={{ height: '300px' }}>
                            <Line data={lineData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
            )}

            <div style={styles.grid2}>
                <div style={styles.card}>
                    <h2 style={styles.h2}>Financial Health & Forecast</h2>
                    <div style={{ marginBottom: '1rem' }}>
                        <button onClick={handleHealth} style={styles.btnSecondary}>Compute Health Score</button>
                        <div style={{ marginTop: '0.5rem', ...styles.muted }}>{healthOutput}</div>
                    </div>
                    <div>
                        <button onClick={handleForecast} style={styles.btnSecondary}>Forecast Next Month</button>
                        <div style={{ marginTop: '0.5rem', ...styles.muted }}>{forecastOutput}</div>
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.h2}>AI Assistant</h2>
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '150px', maxHeight: '200px', overflowY: 'auto' }} id="chat-log">
                        {/* Chat history goes here */}
                    </div>
                    <form onSubmit={handleChat} style={{ display: 'flex', marginTop: '1rem', gap: '0.5rem' }}>
                        <input type="text" name="chatInput" placeholder="Ask 'Save more?'..." required style={{...styles.input, flex: 1}} />
                        <button type="submit" style={styles.btn}>Ask</button>
                    </form>
                </div>
            </div>
            
            <div style={styles.card}>
                <h2 style={styles.h2}>Download Reports</h2>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1rem', color: '#475569' }}>Monthly</h3>
                        <a href={`http://localhost:8080/api/reports/monthly?format=pdf`} style={styles.link}>PDF</a> | 
                        <a href={`http://localhost:8080/api/reports/monthly?format=csv`} style={styles.link}>CSV</a> | 
                        <a href={`http://localhost:8080/api/reports/monthly?format=excel`} style={styles.link}>Excel</a>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1rem', color: '#475569' }}>Budget</h3>
                        <a href={`http://localhost:8080/api/reports/budget?format=pdf`} style={styles.link}>PDF</a> | 
                        <a href={`http://localhost:8080/api/reports/budget?format=csv`} style={styles.link}>CSV</a> | 
                        <a href={`http://localhost:8080/api/reports/budget?format=excel`} style={styles.link}>Excel</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

const styles = {
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' },
    card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    title: { color: '#1e293b', marginBottom: '0.5rem' },
    h2: { color: '#334155', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', fontSize: '1.25rem' },
    muted: { color: '#64748b', fontSize: '0.9rem' },
    formContainer: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    input: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' },
    btn: { padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    btnSecondary: { padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    link: { color: '#3b82f6', textDecoration: 'none', margin: '0 0.25rem' }
};

export default Dashboard;
