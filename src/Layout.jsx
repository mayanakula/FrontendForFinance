import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div className="app-shell" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <nav className="sidebar" style={{ width: '250px', backgroundColor: '#1e293b', color: 'white', padding: '20px' }}>
                <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                    Finance Analyzer
                </div>
                {token && (
                    <>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '1rem' }}>
                                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
                            </li>
                            {role === 'admin' && (
                                <li style={{ marginBottom: '1rem' }}>
                                    <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin View</Link>
                                </li>
                            )}
                            <li style={{ marginBottom: '1rem', cursor: 'pointer', color: '#fb7185' }} onClick={handleLogout}>
                                Logout
                            </li>
                        </ul>
                        <div className="user-info" style={{ marginTop: 'auto', paddingTop: '2rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                            Logged in as: {username} {role === 'admin' ? '(Admin)' : ''}
                        </div>
                    </>
                )}
            </nav>
            <main className="main" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
