import { useState, useEffect } from 'react';
import api from '../services/api';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories', { name });
            setName('');
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating category');
        }
    };

    return (
        <div className="category-manager" style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
            <h2>Manage Categories</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="New Category Name"
                    required
                    style={{ padding: '0.5rem', flexGrow: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Add Category</button>
            </form>
            <div className="tags-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {categories.map(cat => (
                    <span key={cat.id} style={{ background: '#e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                        {cat.name}
                    </span>
                ))}
            </div>
        </div>
    );
};
export default CategoryManager;
