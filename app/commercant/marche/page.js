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

    useEffect(() => {
        fetchSummaries();
    }, []);

    useEffect(() => {
        if (autoPlayMode && stats.length > 0) {
            const firstStat = stats[0];
            if (firstStat) {
                speak(`Résumé du marché avec Marché Plus. La tendance du jour : ${firstStat.category_name} se vend en moyenne à ${firstStat.avg_price} francs.`, 'fr');
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

                <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                    Par catégorie
                </h2>

                <div className="market-stats-grid">
                    {stats.map(stat => (
                        <div key={stat.category_id} className="card">
                            <div className="card-body">
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
                            </div>
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
