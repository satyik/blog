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
                <div className="editor-wrapper" style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ marginBottom: '2rem' }}>{viewMode === 'edit' ? 'Edit Post' : 'Write New Post'}</h2>
                    <form onSubmit={handlePublish}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Enter post title..."
                                style={{
                                    width: '100%', padding: '1rem', fontSize: '1.5rem', fontWeight: 'bold', border: 'none',
                                    borderBottom: '2px solid #eee', outline: 'none', fontFamily: 'inherit'
                                }}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Feature Image</label>
                            <input
                                type="file"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const formData = new FormData();
                                        formData.append('image', file);
                                        try {
                                            const res = await api.post('/upload', formData, {
                                                headers: { 'Content-Type': 'multipart/form-data' }
                                            });
                                            setImage(res.data.url);
                                        } catch (err) {
                                            console.error('Upload failed', err);
                                            alert('Image upload failed');
                                        }
                                    }
                                }}
                                style={{
                                    width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd',
                                    fontSize: '1rem', fontFamily: 'inherit'
                                }}
                            />
                            {/* Fallback URL input */}
                            <input
                                value={image}
                                onChange={e => setImage(e.target.value)}
                                placeholder="Or enter Image URL..."
                                style={{
                                    width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd',
                                    fontSize: '1rem', fontFamily: 'inherit', marginTop: '0.5rem'
                                }}
                            />
                        </div>
                        {image && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '12px', objectFit: 'cover' }} />
                            </div>
                        )}
                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={{
                                    toolbar: {
                                        container: [
                                            [{ 'header': [1, 2, 3, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            ['blockquote', 'code-block'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['link', 'image'],
                                            ['clean']
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
                                                        const res = await api.post('/upload', formData, {
                                                            headers: { 'Content-Type': 'multipart/form-data' }
                                                        });
                                                        const url = res.data.url;
                                                        const quill = this.quill;
                                                        const range = quill.getSelection();
                                                        quill.insertEmbed(range.index, 'image', url);
                                                    } catch (err) {
                                                        console.error('Image upload failed', err);
                                                        alert('Image upload failed');
                                                    }
                                                };
                                            }
                                        }
                                    }
                                }}
                                style={{ height: '300px', marginBottom: '50px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button type="button" onClick={resetForm} style={{ background: 'transparent', border: '1px solid #ddd', padding: '0.8rem 2rem', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" className="btn-primary" style={{
                                background: 'var(--primary)', color: 'white', border: 'none',
                                padding: '0.8rem 2rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer'
                            }}>Publish Post</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Admin;
