'use client';
import { useAuth } from '../../../components/AuthContext';
import { useRouter } from 'next/navigation';
import NavBar from '../../../components/NavBar';

export default function SupplierProfile() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    return (
        <div className="page-content">
            <header className="header-top">
                <div className="header-logo">
                    <span className="logo-icon">👤</span>
                    <span>Profil Fournisseur</span>
                </div>
            </header>

            <div className="container" style={{ paddingTop: 'var(--space-xl)' }}>
                <div className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-sm)' }}>👤</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{user?.name || 'Fournisseur'}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{user?.phone}</p>
                    <span className="badge badge-primary" style={{ marginTop: '8px' }}>Vendeur Vérifié</span>
                </div>

                <div className="grid" style={{ gap: 'var(--space-sm)' }}>
                    <button className="btn btn-secondary" style={{ padding: '16px', textAlign: 'left', display: 'flex', gap: '12px' }}>
                        <span>🏢</span> Informations de l'entreprise
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '16px', textAlign: 'left', display: 'flex', gap: '12px' }}>
                        <span>🌐</span> Préférences de langue
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '16px', textAlign: 'left', display: 'flex', gap: '12px' }}>
                        <span>❓</span> Aide et support
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleLogout}
                        style={{ padding: '16px', textAlign: 'left', display: 'flex', gap: '12px', marginTop: 'var(--space-md)', background: 'var(--error)' }}
                    >
                        <span>🚪</span> Se déconnecter
                    </button>
                </div>
            </div>

            <NavBar role="supplier" />
        </div>
    );
}
