import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroHeader from '../assets/hero-header.jpg';


import { useState } from 'react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    const isActive = (path) => location.pathname === path ? 'nav-item active' : 'nav-item';

    return (
        <>
            {/* Hamburger Button (Mobile Only) */}
            <button className="hamburger-btn" onClick={toggleSidebar}>
                ☰
            </button>

            {/* Overlay (Mobile Only) */}
            {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="profile-section" style={{ display: 'none' }}>
                    {/* Hidden profile for cleaner look, or just keeping avatar */}
                </div>

                <img
                    src={heroHeader}
                    alt="Profile"
                    className="avatar"
                    style={{ width: '120px', height: '120px', borderRadius: '50%', border: 'none', objectFit: 'cover' }}
                />

                <div className="bio-section">
                    <p className="bio-name">Satyik</p>
                    <p className="bio-role">Digital Creator</p>
                </div>

                <nav className="nav-menu">
                    <Link to="/" className={isActive('/')} onClick={closeSidebar}>
                        <span>H</span> <span className="nav-text">Home</span>
                    </Link>
                    {user && (
                        <>
                            <Link to="/admin" className={isActive('/admin')} onClick={closeSidebar}>
                                <span>D</span> <span className="nav-text">Dashboard</span>
                            </Link>
                            <div onClick={() => { logout(); closeSidebar(); }} className="nav-item" style={{ cursor: 'pointer' }}>
                                <span>L</span> <span className="nav-text">Logout</span>
                            </div>
                        </>
                    )}
                    <Link to="/about" className={isActive('/about')} onClick={closeSidebar}>
                        <span>A</span> <span className="nav-text">About</span>
                    </Link>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
