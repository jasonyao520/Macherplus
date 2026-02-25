'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/AuthContext';

export default function AdminDashboard() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        usersCount: 0,
        productsCount: 0,
        requestsCount: 0,
        categoriesCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/auth/login');
            return;
        }
        if (user) {
            fetchStats();
        }
    }, [user, authLoading]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Very simplified MVP stats fetch by fetching actual lists and counting
            const [usersRes, productsRes, categoriesRes, requestsRes] = await Promise.all([
                fetch('/api/admin/users'), // Need to implement this API
                fetch('/api/products?limit=1000'),
                fetch('/api/categories'),
                fetch('/api/requests?limit=1000') // Note: might need an admin flag for all requests
            ]);

            const users = await usersRes.json().catch(() => ({ users: [] }));
            const products = await productsRes.json().catch(() => ({ products: [] }));
            const categories = await categoriesRes.json().catch(() => ({ categories: [] }));
            const requests = await requestsRes.json().catch(() => ({ requests: [] }));

            setStats({
                usersCount: users.users?.length || 0,
                productsCount: products.products?.length || 0,
                categoriesCount: categories.categories?.length || 0,
                requestsCount: requests.requests?.length || 0
            });
        } catch (e) {
            console.error('Error fetching admin stats:', e);
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
                    <Link href="/admin" className="admin-nav-item active" style={{ display: 'block', padding: '16px 24px', color: 'white', textDecoration: 'none', background: 'rgba(255,255,255,0.1)' }}>
                        📊 Tableau de Bord
                    </Link>
                    <Link href="/admin/utilisateurs" className="admin-nav-item" style={{ display: 'block', padding: '16px 24px', color: '#aaa', textDecoration: 'none' }}>
                        👥 Utilisateurs
                    </Link>
                    <Link href="/admin/categories" className="admin-nav-item" style={{ display: 'block', padding: '16px 24px', color: '#aaa', textDecoration: 'none' }}>
                        🏷️ Catégories
                    </Link>
                </nav>
                <div style={{ padding: '24px', borderTop: '1px solid #333' }}>
                    <div style={{ marginBottom: '16px', color: '#aaa' }}>Connecté en tant que: <br /><strong style={{ color: 'white' }}>{user?.name}</strong></div>
                    <button onClick={() => { logout(); router.push('/auth/login'); }} className="btn btn-secondary" style={{ width: '100%', borderColor: '#555', color: '#ccc' }}>
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>Aperçu de la plateforme</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Statistiques globales de Marché+</p>
                    </div>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                    <div className="card" style={{ padding: '24px', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Utilisateurs</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.usersCount}</div>
                            </div>
                            <div style={{ fontSize: '2rem', background: 'rgba(0,0,0,0.05)', padding: '12px', borderRadius: '12px' }}>👥</div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '24px', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Produits Actifs</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.productsCount}</div>
                            </div>
                            <div style={{ fontSize: '2rem', background: 'rgba(45, 125, 70, 0.1)', padding: '12px', borderRadius: '12px' }}>📦</div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '24px', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Transactions (Demandes)</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>{stats.requestsCount}</div>
                            </div>
                            <div style={{ fontSize: '2rem', background: 'rgba(224, 122, 47, 0.1)', padding: '12px', borderRadius: '12px' }}>📋</div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '24px', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Catégories</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.categoriesCount}</div>
                            </div>
                            <div style={{ fontSize: '2rem', background: 'rgba(0,0,0,0.05)', padding: '12px', borderRadius: '12px' }}>🏷️</div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '32px', background: 'white' }}>
                    <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '1.5rem', fontWeight: 'bold' }}>Accès Rapides</h2>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Link href="/admin/utilisateurs" className="btn btn-primary" style={{ padding: '16px 24px' }}>
                            Gérer les utilisateurs
                        </Link>
                        <Link href="/admin/categories" className="btn btn-secondary" style={{ padding: '16px 24px' }}>
                            Gérer les catégories
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
