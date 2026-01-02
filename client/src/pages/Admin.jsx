import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const Admin = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard', 'create', 'edit'

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (!loading && !user) navigate('/login');
        if (user) fetchPosts();
    }, [user, loading, navigate]);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/posts?sort=recent');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/posts/${editingId}`, { title, content, image, published: true });
            } else {
                await api.post('/posts', { title, content, image, published: true });
            }
            resetForm();
            fetchPosts();
            setViewMode('dashboard');
        } catch (err) {
            console.error('Publish error:', err);
            alert('Error saving post: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEdit = (post) => {
        setTitle(post.title);
        setContent(post.content);
        setImage(post.image || '');
        setEditingId(post.id);
        setViewMode('edit');
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this post?')) {
            await api.delete(`/posts/${id}`);
            fetchPosts();
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setImage('');
        setEditingId(null);
        setViewMode('dashboard');
    }

    if (loading) return <div>Loading...</div>;

    // Calculate Stats
    const totalViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalPosts = posts.length;

    return (
        <div className="admin-container">
            <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--text-light)', margin: 0 }}>Manage your blog content</p>
                </div>
                <div>
                    {viewMode === 'dashboard' && (
                        <button className="btn-primary" onClick={() => setViewMode('create')}>
                            + New Post
                        </button>
                    )}
                    {viewMode !== 'dashboard' && (
                        <button className="btn-secondary" onClick={resetForm} style={{ background: '#ddd', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', cursor: 'pointer' }}>
                            ← Back to Dashboard
                        </button>
                    )}
                </div>
            </header>

            {viewMode === 'dashboard' && (
                <>
                    {/* Stats Cards */}
                    <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>Total Views</h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--primary)' }}>{totalViews}</p>
                        </div>
                        <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>Published Posts</h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#00BFA5' }}>{totalPosts}</p>
                        </div>
                    </div>

                    {/* Posts List */}
                    <h2 style={{ marginBottom: '1.5rem' }}>Your Posts</h2>
                    <div className="admin-posts-list" style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-light)' }}>Title</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-light)' }}>Views</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-light)' }}>Date</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-light)', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <tr key={post.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{post.title}</td>
                                        <td style={{ padding: '1rem' }}>{post.views || 0}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button onClick={() => handleEdit(post)} style={{ marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✏️</button>
                                            <button onClick={() => handleDelete(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {(viewMode === 'create' || viewMode === 'edit') && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <form onSubmit={handlePublish} style={{ width: '100%', maxWidth: '1100px' }}>

                        {/* Use the exact same layout wrapper as Post.jsx */}
                        <article className="newspaper-layout" style={{ margin: '0', paddingBottom: '2rem' }}>
                            <header className="article-header">
                                {/* Mock Meta Top */}
                                <div className="meta-top" style={{ textAlign: 'center', marginBottom: '1rem', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-main)' }}>
                                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>

                                {/* Headline Input */}
                                <textarea
                                    className="headline headline-input"
                                    value={title}
                                    onChange={e => {
                                        setTitle(e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                    }}
                                    placeholder="Type Headline Here..."
                                    rows={1}
                                    required
                                />

                                {/* Mock Byline */}
                                <div className="byline">
                                    By <span className="author" style={{ fontWeight: 'bold' }}>{user?.username || 'You'}</span>
                                    <span className="bullet"> • </span>
                                    <span className="views">Draft Preview</span>
                                </div>

                                {/* Image Uploader / Feature Image */}
                                <div className="feature-image-wrapper" style={{ marginBottom: '3rem', position: 'relative', minHeight: '100px', border: image ? 'none' : '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>

                                    {image ? (
                                        <>
                                            <img src={image} alt="Feature" style={{ width: '100%', maxHeight: '600px', objectFit: 'cover', borderRadius: '4px', filter: 'sepia(0.2)' }} />
                                            <div className="image-overlay" onClick={() => document.getElementById('feature-upload').click()}>
                                                <span>Click to Change Image</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div onClick={() => document.getElementById('feature-upload').click()} style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                                            <p>Click to Upload Feature Image</p>
                                            <p style={{ fontSize: '0.8rem' }}>(or paste URL below)</p>
                                        </div>
                                    )}

                                    <input
                                        id="feature-upload"
                                        type="file"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const formData = new FormData();
                                                formData.append('image', file);
                                                try {
                                                    const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                                                    setImage(res.data.url);
                                                } catch (err) { console.error(err); alert('Upload failed'); }
                                            }
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                                {/* Fallback URL input (small and unobtrusive) */}
                                {!image && (
                                    <input
                                        className="url-fallback-input"
                                        value={image}
                                        onChange={e => setImage(e.target.value)}
                                        placeholder="...or paste image URL here"
                                    />
                                )}
                            </header>

                            {/* Editor Body */}
                            <div className="article-body-editor">
                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    modules={{
                                        toolbar: {
                                            container: [
                                                [{ 'header': [1, 2, false] }],
                                                ['bold', 'italic', 'underline', 'blockquote'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['link', 'image', 'clean']
                                            ],
                                            handlers: {
                                                image: function () {
                                                    const input = document.createElement('input');
                                                    input.setAttribute('type', 'file');
                                                    input.setAttribute('accept', 'image/*');
                                                    input.click();
                                                    input.onchange = async () => {
                                                        const file = input.files[0];
                                                        const formData = new FormData();
                                                        formData.append('image', file);
                                                        try {
                                                            const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                                                            this.quill.insertEmbed(this.quill.getSelection().index, 'image', res.data.url);
                                                        } catch (err) { console.error('Image upload failed', err); }
                                                    };
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>

                            {/* Action Buttons (Sticky Bottom or Inline) */}
                            <div className="editor-actions" style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '1rem', borderTop: '1px double #ccc', paddingTop: '2rem' }}>
                                <button type="button" onClick={resetForm} style={{ background: 'transparent', border: '1px solid #888', padding: '0.8rem 2rem', borderRadius: '30px', cursor: 'pointer', fontFamily: 'var(--font-main)' }}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ padding: '0.8rem 3rem' }}>
                                    {editingId ? 'Update Article' : 'Publish Article'}
                                </button>
                            </div>
                        </article>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Admin;
