'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/AuthContext';
import { useAudio } from '../../components/AudioContext';
import NavBar from '../../components/NavBar';
import LanguageSelector from '../../components/LanguageSelector';
import AudioButton from '../../components/AudioButton';

export default function SupplierDashboard() {
    const { user, loading: authLoading } = useAuth();
    const { speak, autoPlayMode, toggleAutoPlay, language } = useAudio();
    const router = useRouter();
    const [stats, setStats] = useState({ products: 0, pendingRequests: 0 });
    const [recentRequests, setRecentRequests] = useState([]);
    const [marketStats, setMarketStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
            return;
        }
        if (user && user.role !== 'supplier') {
            router.push('/');
            return;
        }
        if (user) {
            fetchDashboardData();
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (user && autoPlayMode && !loading) {
            const hasWelcomed = sessionStorage.getItem(`welcomed_supplier_${user.id}`);
            if (!hasWelcomed) {
                let msg = `Bienvenue ${user.name}. Vous avez ${stats.products} produits en ligne et ${stats.pendingRequests} nouvelles commandes.`;
                if (language === 'dioula') {
                    msg = `I ni tché ${user.name}. I ka fènw ye ${stats.products}. Nyinikali kura be yen ${stats.pendingRequests}.`; // Phonetic Dioula
                } else if (language === 'baoule') {
                    msg = `Akwaba ${user.name}. Ninnge nɲɔn yɛ ɔ wɔ lɔ ${stats.products}. Tuma kɛn nda man ${stats.pendingRequests}.`; // Phonetic Baoulé
                }
                speak(msg, language);
                sessionStorage.setItem(`welcomed_supplier_${user.id}`, 'true');
            }
        }
    }, [loading, autoPlayMode, user, language, stats.products, stats.pendingRequests, speak]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch products to count
            const prodRes = await fetch(`/api/products?supplier=${user.id}`);
            const prodData = await prodRes.json();

            // Fetch requests
            const reqRes = await fetch('/api/requests');
            const reqData = await reqRes.json();

            const reqs = reqData.requests || [];
            const pending = reqs.filter(r => r.status === 'pending').length;

            // Fetch market stats
            const statsRes = await fetch('/api/market/stats');
            const statsData = await statsRes.json();

            // Filter stats to only categories where supplier has products
            const supplierCategoryIds = [...new Set(prodData.products?.map(p => p.category_id) || [])];
            const relevantStats = (statsData.stats || []).filter(s => supplierCategoryIds.includes(s.category_id));

            setMarketStats(relevantStats);

            setStats({
                products: prodData.products?.length || 0,
                pendingRequests: pending
            });

            setRecentRequests(reqs.slice(0, 3));
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    if (authLoading || loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <header className="header-top">
                <div className="header-logo">
                    <span className="logo-icon">🏪</span>
                    <span>Fournisseur<span style={{ color: 'var(--accent)' }}>+</span></span>
                </div>
                <div className="header-actions">
                    <LanguageSelector />
                    <button
                        className={`btn btn-icon ${autoPlayMode ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={toggleAutoPlay}
                    >
                        {autoPlayMode ? '🔊' : '🔇'}
                    </button>
                </div>
            </header>

            <div className="container" style={{ paddingTop: 'var(--space-md)', paddingBottom: 'calc(80px + var(--space-lg))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>
                            Tableau de bord
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Bienvenue, {user?.name}</p>
                    </div>
                    <AudioButton
                        text={`Tableau de bord. Vous avez ${stats.products} produits et ${stats.pendingRequests} demandes.`}
                        size="lg"
                    />
                </div>

                <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center', background: 'var(--surface-light)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.products}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Produits Actifs</div>
                    </div>
                    <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center', background: 'var(--surface-light)', border: stats.pendingRequests > 0 ? '2px solid var(--accent)' : 'none' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stats.pendingRequests > 0 ? 'var(--accent)' : 'inherit' }}>{stats.pendingRequests}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nouv. Demandes</div>
                    </div>
                </div>

                <div style={{ marginBottom: 'var(--space-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                        <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'bold' }}>Actions Rapides</h2>
                    </div>
                    <div className="actions-grid">
                        <Link href="/fournisseur/produits/nouveau" className="btn btn-primary" style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}>
                            <span>➕</span> Ajouter un produit
                        </Link>
                        <Link href="/fournisseur/produits" className="btn btn-secondary" style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}>
                            <span>📦</span> Gérer le catalogue
                        </Link>
                    </div>
                </div>

                {/* ======= STATISTIQUES EN TEMPS RÉEL ======= */}
                {marketStats.length > 0 && (
                    <div style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                            <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'bold' }}>Tendances du marché</h2>
                            <span className="badge badge-primary">En direct</span>
                        </div>
                        <div className="market-trends-grid">
                            {marketStats.map(stat => (
                                <div key={stat.category_id} className="card" style={{ padding: 'var(--space-md)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '24px' }}>{stat.category_icon}</span>
                                        <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{stat.category_name}</h3>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Prix moyen actuel</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'var(--primary)' }}>
                                                {stat.avg_price} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>FCFA/{stat.unit}</span>
                                            </div>
                                        </div>
                                        <AudioButton text={`Le prix moyen actuel pour ${stat.category_name} est de ${stat.avg_price} francs CFA par ${stat.unit}.`} size="sm" />
                                    </div>
                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--danger)' }}>Min: {stat.min_price} F</span>
                                        <span style={{ color: 'var(--success)' }}>Max: {stat.max_price} F</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ marginTop: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                        <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'bold' }}>Demandes Récentes</h2>
                        <Link href="/fournisseur/demandes" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                            Tout voir
                        </Link>
                    </div>

                    {recentRequests.length === 0 ? (
                        <div className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)', opacity: 0.5 }}>📭</div>
                            <p style={{ color: 'var(--text-muted)' }}>Aucune demande pour le moment.</p>
                        </div>
                    ) : (
                        <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 'var(--space-sm)' }}>
                            {recentRequests.map(req => (
                                <div key={req.id} className="card" style={{ padding: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{req.product_name || 'Produit'}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            {req.quantity} {req.unit || 'kg'} • {new Date(req.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`badge ${req.status === 'pending' ? 'badge-warning' : req.status === 'accepted' ? 'badge-success' : 'badge-neutral'}`}>
                                            {req.status === 'pending' ? 'En attente' : req.status === 'accepted' ? 'Accepté' : req.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <NavBar role="supplier" />
        </div>
    );
}
