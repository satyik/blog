import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="logo">My Blog</Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    {user ? (
                        <>
                            <Link to="/admin">Dashboard</Link>
                            <button onClick={logout} className="logout-btn">Logout</button>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
