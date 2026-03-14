import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('https://backendforfinance.onrender.com/api/auth/register', { username, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <section className="center-card" style={styles.section}>
            <div className="card" style={styles.card}>
                <h1 style={styles.title}>Register</h1>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleRegister} style={styles.form}>
                    <label style={styles.label}>
                        Username
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={styles.input} />
                    </label>
                    <label style={styles.label}>
                        Email
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={styles.input} />
                    </label>
                    <label style={styles.label}>
                        Password
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={styles.input} />
                    </label>
                    <button type="submit" style={styles.button}>Create Account</button>
                </form>
                <p style={styles.muted}>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </section>
    );
};

const styles = {
    section: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
    card: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    title: { marginBottom: '1.5rem', textAlign: 'center', color: '#1e293b' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    label: { display: 'flex', flexDirection: 'column', fontSize: '0.9rem', color: '#475569' },
    input: { padding: '0.5rem', marginTop: '0.25rem', borderRadius: '4px', border: '1px solid #cbd5e1' },
    button: { padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    error: { backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' },
    muted: { textAlign: 'center', marginTop: '1rem', color: '#64748b', fontSize: '0.9rem' }
};

export default Register;
