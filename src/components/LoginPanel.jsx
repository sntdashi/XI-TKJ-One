import React, { useState } from 'react';

const LoginPanel = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lakukan validasi login di sini
        if (email === '' || password === '') {
            setError('Email dan password harus diisi');
        } else {
            setError('');
            // Panggil fungsi login di sini
            console.log('Logging in with', { email, password });
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Login</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        width: '300px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    input: {
        padding: '10px',
        fontSize: '14px',
        border: '1px solid #ccc',
        borderRadius: '3px',
    },
    button: {
        padding: '10px',
        fontSize: '14px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        fontSize: '12px',
    },
};

export default LoginPanel;
