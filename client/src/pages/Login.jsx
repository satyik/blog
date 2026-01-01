import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="login-container" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                <h2 style={{ marginBottom: '2rem', color: 'var(--text-main)' }}>Welcome Back</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                    />
                    <button type="submit" className="btn-primary" style={{
                        background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '12px',
                        border: 'none', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', marginTop: '1rem'
                    }}>
                        Sign In
                    </button>
                </form>
                <p style={{ marginTop: '2rem', color: 'var(--text-light)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
