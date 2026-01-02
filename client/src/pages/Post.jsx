import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import 'react-quill-new/dist/quill.snow.css'; // Import Quill Styles to match Admin

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch Post
        setLoading(true); // Reset loading on id change
        api.get(`/posts/${id}`)
            .then(res => {
                setPost(res.data);
                // Fetch recent for "Related" - only if post fetch succeeds
                return api.get('/posts?sort=recent');
            })
            .then(res => {
                // Filter out current post
                if (res && res.data) {
                    setRelatedPosts(res.data.filter(p => p.id !== id).slice(0, 3));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching post:", err);
                setError('Post not found');
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="main-content" style={{ textAlign: 'center', marginTop: '5rem' }}>Loading article...</div>;
    if (error) return <div className="main-content" style={{ textAlign: 'center', marginTop: '5rem' }}>{error}</div>;
    if (!post) return null;

    return (
        <div className="main-content animate-fade-in">
            {/* Newspaper Article Layout */}
            <article className="newspaper-layout">
                <header className="article-header">
                    <div className="meta-top" style={{ textAlign: 'center', marginBottom: '1rem', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-main)' }}>
                        {new Date(post.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>

                    <h1 className="headline">{post.title}</h1>

                    <div className="byline">
                        By <span className="author" style={{ fontWeight: 'bold' }}>{post.author?.username || 'Unknown Author'}</span>
                        <span className="bullet"> • </span>
                        <span className="views">{post.views || 0} Views</span>
                    </div>

                    {post.image && (
                        <div className="feature-image" style={{ marginBottom: '3rem' }}>
                            <img src={post.image} alt={post.title} style={{ width: '100%', maxHeight: '600px', objectFit: 'cover', borderRadius: '4px', filter: 'sepia(0.2)' }} />
                            <div style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic' }}>Image: {post.title}</div>
                        </div>
                    )}
                </header>

                <div className="ql-container ql-snow" style={{ border: 'none' }}>
                    <div className="article-body ql-editor" dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                <div className="separator"></div>

                <div className="tags-section" style={{ textAlign: 'center', marginTop: '2rem' }}>
                    {post.tags && post.tags.map(tag => (
                        <span key={tag.id} className="news-tag" style={{ margin: '0 0.5rem', fontSize: '1rem', fontWeight: 'bold' }}>#{tag.name}</span>
                    ))}
                </div>
            </article>

            {/* Related Posts */}
            <div className="related-section" style={{ maxWidth: '700px', margin: '3rem auto' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', borderBottom: '2px solid var(--text-brown)', display: 'inline-block', paddingBottom: '0.3rem', marginBottom: '1.5rem' }}>Read Next</h3>
                <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {relatedPosts.map(p => (
                        <Link to={`/posts/${p.id}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <article className="post-card" style={{ border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
                                <img
                                    src={p.image || `https://source.unsplash.com/random/400x300?sig=${p.id}`}
                                    alt={p.title}
                                    className="post-image"
                                    style={{ height: '140px', borderBottom: '1px solid #eee', borderRadius: '8px 8px 0 0' }}
                                />
                                <div className="post-content" style={{ padding: '0.8rem' }}>
                                    <h4 className="post-title" style={{ fontSize: '0.95rem', margin: 0 }}>{p.title}</h4>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Post;
