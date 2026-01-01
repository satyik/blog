import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/login');
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="login-container" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Create Account</h2>
                <p style={{ marginBottom: '2rem', color: 'var(--text-light)' }}>Join our community today</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                    />
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
                        Get Started
                    </button>
                </form>
                <p style={{ marginTop: '2rem', color: 'var(--text-light)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
