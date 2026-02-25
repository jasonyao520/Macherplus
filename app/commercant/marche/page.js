'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/AuthContext';
import { useAudio } from '../../../components/AudioContext';
import NavBar from '../../../components/NavBar';
import AudioButton from '../../../components/AudioButton';

export default function MarketSummaryPage() {
    const { user } = useAuth();
    const { speak, autoPlayMode } = useAudio();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);

    useEffect(() => {
        fetchSummaries();
    }, []);

    useEffect(() => {
        if (autoPlayMode && stats.length > 0) {
            const firstStat = stats[0];
            if (firstStat) {
                speak(`Bienvenue sur l'analyse du marché. Actuellement, le marché compte ${stats.length} catégories de produits actives. Cliquez sur une catégorie pour voir les offres en détail.`, 'fr');
            }
        }
    }, [stats, autoPlayMode]);

    const fetchSummaries = async () => {
        try {
            const res = await fetch('/api/market/stats');
            const data = await res.json();
            setStats(data.stats || []);
        } catch { }
        setLoading(false);
    };

    const toggleCategory = async (categoryId) => {
        if (expandedCategory === categoryId) {
            setExpandedCategory(null);
            setCategoryProducts([]);
            return;
        }

        setExpandedCategory(categoryId);
        setCategoryProducts([]); // Reset products to show loading state

        try {
            const res = await fetch(`/api/products?category=${categoryId}`);
            const data = await res.json();
            setCategoryProducts(data.products || []);
        } catch (error) {
            console.error('Erreur lors du chargement des produits', error);
        }
    };

    return (
        <div className="page-content">
            <header className="header-top">
                <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700 }}>📊 Suivi du Marché <span className="badge badge-primary" style={{ fontSize: '10px', verticalAlign: 'middle', marginLeft: '8px' }}>En direct</span></h1>
                <AudioButton
                    text={stats.length > 0
                        ? `Tendances du marché. Il y a ${stats.length} catégories de produits actives.`
                        : 'Aucun produit sur le marché pour le moment.'
                    }
                    size="lg"
                />
            </header>

            <div className="container" style={{ paddingTop: 'var(--space-md)', paddingBottom: 'calc(80px + var(--space-lg))' }}>

                <div style={{ backgroundColor: 'var(--surface-light)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', borderLeft: '4px solid var(--primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '1.05rem', lineHeight: '1.5', margin: 0, color: 'var(--text)' }}>
                            <strong style={{ color: 'var(--primary)' }}>Résumé du marché :</strong> Actuellement, <strong>{stats.reduce((acc, stat) => acc + stat.total_suppliers, 0)} vendeurs</strong> proposent des produits dans <strong>{stats.length} catégories</strong> différentes. Cliquez sur une catégorie ci-dessous pour voir les détails de chaque produit et leurs prix.
                        </p>
                    </div>
                </div>

                <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                    Marchandises
                </h2>

                <div className="market-stats-grid">
                    {stats.map(stat => (
                        <div key={stat.category_id} className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', border: expandedCategory === stat.category_id ? '2px solid var(--primary)' : '1px solid var(--border-light)' }}>
                            <div className="card-body" onClick={() => toggleCategory(stat.category_id)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                                    <div style={{ fontSize: '40px', flexShrink: 0, background: 'rgba(224, 122, 47, 0.1)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px' }}>
                                        {stat.category_icon || '📦'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>
                                            {stat.category_name}
                                        </h3>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', gap: '8px', marginTop: '2px' }}>
                                            <span>🛒 {stat.total_products} offres</span>
                                            <span>•</span>
                                            <span>👨🏾‍🌾 {stat.total_suppliers} vendeurs</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '12px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '2px' }}>Prix moyen</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                                            {stat.avg_price} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>FCFA/{stat.unit}</span>
                                        </div>
                                    </div>
                                    <AudioButton
                                        text={`Pour la catégorie ${stat.category_name}, le prix moyen est de ${stat.avg_price} francs CFA par ${stat.unit}. Le prix le plus bas trouvé est de ${stat.min_price} francs, et le plus haut est de ${stat.max_price} francs.`}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '0 4px', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <div style={{ color: 'var(--secondary)' }}>
                                        ↓ Min: {stat.min_price} F
                                    </div>
                                    <div style={{ color: 'var(--danger)' }}>
                                        ↑ Max: {stat.max_price} F
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '16px', color: 'var(--primary)', fontWeight: 'bold' }}>
                                    {expandedCategory === stat.category_id ? '▲ Masquer les offres' : '▼ Explorer les offres'}
                                </div>
                            </div>

                            {/* Expanded Product List */}
                            {expandedCategory === stat.category_id && (
                                <div style={{ borderTop: '1px solid var(--border-light)', padding: 'var(--space-md)', backgroundColor: 'var(--bg)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
                                    <h4 style={{ fontWeight: 600, marginBottom: '12px', fontSize: '1.05rem' }}>Détails des offres ({categoryProducts.length})</h4>
                                    {categoryProducts.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-light)', fontStyle: 'italic' }}>
                                            Chargement des produits...
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {categoryProducts.map(p => (
                                                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                                                    <div style={{ flex: 1, paddingRight: '8px' }}>
                                                        <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text)' }}>{p.name}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Vendeur : {p.supplier_business || p.supplier_name}</div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ fontWeight: 800, color: 'var(--primary)', textAlign: 'right' }}>
                                                            {p.price} F <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>/{p.unit}</span>
                                                        </div>
                                                        <div onClick={(e) => { e.stopPropagation(); speak(`Offre de ${p.supplier_business || p.supplier_name}. Le produit ${p.name} est vendu à ${p.price} francs le ${p.unit}.`, 'fr'); }}>
                                                            <button className="btn btn-icon btn-ghost" style={{ width: '32px', height: '32px', fontSize: '1rem' }} aria-label="Écouter le prix">
                                                                🔊
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {loading && (
                    <div className="flex-center" style={{ padding: '60px 0' }}>
                        <div className="loading-spinner"></div>
                    </div>
                )}
            </div>

            <NavBar role="merchant" />
        </div>
    );
}
