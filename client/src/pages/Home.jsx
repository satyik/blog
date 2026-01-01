import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';
import introImage from '../assets/intro-aside.jpg';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/posts');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const scrollToPosts = () => {
        const postsSection = document.getElementById('latest-posts');
        if (postsSection) {
            postsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-image-wrapper">
                    <img
                        src={heroImage}
                        alt="Hero"
                        className="hero-image"
                    />
                    <div className="hero-badge">
                        PERSONAL<br />INDEPENDENT<br />BLOG
                    </div>
                </div>

                <div className="hero-content">
                    <h4 className="site-title">Satyik.blog</h4>
                    <div className="tag-pill">Personal Blog</div>
                    <h1 className="hero-headline">
                        Welcome To the<br />
                        Moonrise<br />
                        Kingdom
                    </h1>

                    <div className="hero-actions">
                        <button className="btn-primary" onClick={scrollToPosts}>
                            Start Reading
                            <span className="btn-icon">↗</span>
                        </button>


                    </div>
                </div>
            </section>

            {/* Intro / Welcome Message */}
            <section className="intro-section">
                <div>
                    <p className="drop-cap-text">
                        Hello there.<br /><br />
                        That you are here—that life exists and identity exists—<br />
                        that the powerful play goes on, and you may contribute a verse.<br />
                        What will your verse be?<br /><br />
                        <span style={{ backgroundColor: 'red', color: 'white', padding: '0 4px' }}>This is me trying to find that verse.</span><br /><br />
                        I’ve said it before, and I’ll say it again: life moves pretty fast, and if you don’t stop and look around once in a while, you could miss it.<br />
                        Maybe this is me finally stopping to take a look around.<br /><br />
                        And maybe life isn’t about having all the answers, but about daring to ask the questions
                    </p>
                </div>
                <div className="intro-aside">
                    <img
                        src={introImage}
                        alt="Intro illustration"
                        style={{ width: '100%', height: 'auto', borderRadius: '12px', objectFit: 'cover' }}
                    />
                </div>
            </section>

            {/* Posts Grid */}
            <h2 className="section-header" id="latest-posts">Latest Articles</h2>
            <div className="posts-grid">
                {posts.map((post, index) => (
                    <Link to={`/posts/${post.id}`} key={post.id} style={{ textDecoration: 'none' }}>
                        <article className="post-card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <img
                                src={post.image || `https://source.unsplash.com/random/400x300?sig=${post.id}`}
                                alt={post.title}
                                className="post-image"
                                onError={(e) => {
                                    e.target.src = `https://placehold.co/600x400/FDF1E9/3E2723?text=${encodeURIComponent(post.title)}`;
                                }}
                            />
                            <div className="post-content">
                                <h3 className="post-title">{post.title}</h3>
                                <div className="post-meta">
                                    <span>Read article ↗</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
