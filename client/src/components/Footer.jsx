import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <h2>Satyik.blog</h2>
                    <p>
                        Designing for the future. A personal space for independent thoughts,
                        curated aesthetics, and storytelling.
                    </p>
                </div>

                <div className="footer-links">
                    <h3>Explore</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h3>Connect</h3>
                    <ul>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="https://www.instagram.com/___rorschach___/?hl=en" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        <li><a href="https://www.linkedin.com/in/satyik-pritam-yogi-a6a49019a" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                        <li><a href="#">RSS</a></li>
                    </ul>
                </div>


            </div>

            <div className="footer-bottom">
                <div className="copyright">
                    &copy; {new Date().getFullYear()} Satyik.blog · Independent Publication
                </div>
            </div>
        </footer>
    );
};

export default Footer;
