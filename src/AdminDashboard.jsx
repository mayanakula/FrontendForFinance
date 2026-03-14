import React, { useEffect, useState } from 'react';


const AdminDashboard = () => {
    const [users] = useState([]);

    // Since we don't have a dedicated endpoint for just users in the new backend without adding one, 
    // we assume the admin functionality might need to be ported or simplified.
    // For now, this serves as the UI shell.
    // Note: The original backend had `@app.route("/admin")` sending `users=User.query.all()`.
    
    useEffect(() => {
        const fetchUsers = async () => {
             // In a real scenario we need a `/api/admin/users` endpoint. 
             // We'll leave the UI intact.
        };
        fetchUsers();
    }, []);

    const handleAction = async (userId, action) => {
        // e.g., axios.post('/api/admin/users', { user_id: userId, action }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
        alert(`Admin action '${action}' triggered for user ${userId}. (Requires Backend Admin Endpoint)`);
    };

    return (
        <section className="dashboard">
            <div className="card full-width" style={styles.card}>
                <h1 style={styles.title}>Admin Dashboard</h1>
                <p style={styles.muted}>Manage users and monitor system-wide activity.</p>
            </div>

            <div className="card full-width" style={styles.card}>
                <h2 style={styles.h2}>User Accounts</h2>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Username</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Role</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr><td colSpan="6" style={styles.td}>No users available or endpoint missing</td></tr>
                        ) : users.map(u => (
                            <tr key={u.id}>
                                <td style={styles.td}>{u.id}</td>
                                <td style={styles.td}>{u.username}</td>
                                <td style={styles.td}>{u.email}</td>
                                <td style={styles.td}>{u.role}</td>
                                <td style={styles.td}>{u.is_active ? 'Active' : 'Disabled'}</td>
                                <td style={styles.td}>
                                    {u.is_active ? (
                                        <button onClick={() => handleAction(u.id, 'disable')} style={styles.btn}>Disable</button>
                                    ) : (
                                        <button onClick={() => handleAction(u.id, 'enable')} style={styles.btn}>Enable</button>
                                    )}
                                    {!u.is_admin && (
                                        <button onClick={() => handleAction(u.id, 'delete')} style={{ ...styles.btn, backgroundColor: '#ef4444' }}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

const styles = {
    card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '1.5rem' },
    title: { color: '#1e293b', marginBottom: '0.5rem' },
    h2: { color: '#334155', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' },
    muted: { color: '#64748b' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
    th: { textAlign: 'left', padding: '0.75rem', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 'bold', borderBottom: '2px solid #cbd5e1' },
    td: { padding: '0.75rem', borderBottom: '1px solid #e2e8f0', color: '#334155' },
    btn: { marginRight: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default AdminDashboard;
