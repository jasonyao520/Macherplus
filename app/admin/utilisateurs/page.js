'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthContext';

export default function AdminUsers() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/auth/login');
            return;
        }
        if (user) {
            fetchUsers();
        }
    }, [user, authLoading]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
            }
        } catch (e) {
            console.error('Error fetching users:', e);
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
                    <Link href="/admin/utilisateurs" className="admin-nav-item active" style={{ display: 'block', padding: '16px 24px', color: 'white', textDecoration: 'none', background: 'rgba(255,255,255,0.1)' }}>
                        👥 Utilisateurs
                    </Link>
                    <Link href="/admin/categories" className="admin-nav-item" style={{ display: 'block', padding: '16px 24px', color: '#aaa', textDecoration: 'none' }}>
                        🏷️ Catégories
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>Gestion des utilisateurs</h1>
                        <p style={{ color: 'var(--text-muted)' }}>{users.length} utilisateurs inscrits</p>
                    </div>
                </div>

                <div className="card" style={{ background: 'white', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '2px solid rgba(0,0,0,0.05)' }}>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Nom / ID</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Rôle</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Téléphone</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Date d'inscription</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            Aucun utilisateur trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ fontWeight: 'bold' }}>{u.name}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.id.substring(0, 8)}...</div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span className={`badge ${u.role === 'admin' ? 'badge-primary' : u.role === 'supplier' ? 'badge-warning' : 'badge-neutral'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>{u.phone}</td>
                                            <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                <button className="btn btn-ghost" style={{ padding: '8px 16px', color: 'var(--error)' }}>
                                                    Bannir
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
