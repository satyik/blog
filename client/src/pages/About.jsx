import aboutImage from '../assets/about-me.png';
const About = () => {
    return (
        <div className="home-container animate-fade-in">
            <section className="hero-section" style={{ marginBottom: '4rem', gap: '2rem' }}>
                <div className="hero-content">
                    <div className="tag-pill">My Story</div>
                    <h1 className="hero-headline" style={{ fontSize: '3rem' }}>
                        Curating Digital<br />
                        Experiences.
                    </h1>
                    <p className="drop-cap-text">
                        Welcome to my digital garden. I'm Satyik, a software developer passionate about everything.
                    </p>
                </div>
                <div className="hero-image-wrapper" style={{ height: '400px', borderRadius: '24px' }}>
                    <img
                        src={aboutImage}
                        alt="About Satyik"
                        className="hero-image"
                    />
                </div>
            </section>

            <div className="intro-section" style={{ gridTemplateColumns: '1fr', padding: '4rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-brown)' }}>
                    <blockquote style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.4rem',
                        fontStyle: 'italic',
                        borderLeft: '4px solid var(--accent-orange)',
                        paddingLeft: '1.5rem',
                        margin: '0 0 2rem 0',
                        color: 'black'
                    }}>
                        “Words are, in my not-so-humble opinion, our most inexhaustible source of magic.” <br />
                        <span style={{ fontSize: '1rem', fontStyle: 'normal', opacity: 0.7 }}>— Albus Dumbledore</span>
                    </blockquote>

                    <p style={{ marginBottom: '1.5rem' }}>
                        I believe they can wound or heal, reveal or conceal—but they always carry truth when spoken with care.
                    </p>
                    <p>
                        This is a freak, a nerd, trying to notice, to remember, to shape meaning from chaos. Someone learning to sit with uncertainty, and oddly, to love it. To hold on to endings that feel unfinished, to leave the door slightly open, letting beginnings slip in disguised as conclusions.
                    </p>
                </div>

                {/* Buttons removed as per user request */}
            </div>
        </div>
    );
};

export default About;
