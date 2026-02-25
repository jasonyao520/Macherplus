'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthContext';

export default function AdminCategories() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/auth/login');
            return;
        }
        if (user) {
            fetchCategories();
        }
    }, [user, authLoading]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data.categories || []);
            }
        } catch (e) {
            console.error('Error fetching categories:', e);
        }
        setLoading(false);
    };

    if (authLoading || loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--surface-dark)' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-dark)' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', background: '#111', color: 'white', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px', fontSize: '1.5rem', fontWeight: 'bold', borderBottom: '1px solid #333' }}>
                    ⚙️ Admin<span style={{ color: 'var(--accent)' }}>+</span>
                </div>
                <nav style={{ flex: 1, padding: '16px 0' }}>
                    <Link href="/admin" className="admin-nav-item" style={{ display: 'block', padding: '16px 24px', color: '#aaa', textDecoration: 'none' }}>
                        📊 Tableau de Bord
                    </Link>
                    <Link href="/admin/utilisateurs" className="admin-nav-item" style={{ display: 'block', padding: '16px 24px', color: '#aaa', textDecoration: 'none' }}>
                        👥 Utilisateurs
                    </Link>
                    <Link href="/admin/categories" className="admin-nav-item active" style={{ display: 'block', padding: '16px 24px', color: 'white', textDecoration: 'none', background: 'rgba(255,255,255,0.1)' }}>
                        🏷️ Catégories
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>Gestion des catégories</h1>
                        <p style={{ color: 'var(--text-muted)' }}>{categories.length} catégories disponibles</p>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '12px 24px' }}>
                        ➕ Nouvelle Catégorie
                    </button>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {categories.length === 0 ? (
                        <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Aucune catégorie trouvée.
                        </div>
                    ) : (
                        categories.map(cat => (
                            <div key={cat.id} className="card" style={{ padding: '24px', background: 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{ fontSize: '2.5rem', background: 'rgba(0,0,0,0.05)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{cat.name}</h3>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ID: {cat.id}</div>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Label Audio (FR)</div>
                                    <div style={{ fontStyle: 'italic' }}>"{cat.audio_label_fr || cat.name}"</div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button className="btn btn-secondary" style={{ flex: 1, padding: '8px' }}>✏️ Modifier</button>
                                    <button className="btn btn-ghost" style={{ padding: '8px 16px', color: 'var(--error)' }}>🗑️</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
