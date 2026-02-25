'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/AuthContext';
import { useAudio } from '../../../components/AudioContext';
import NavBar from '../../../components/NavBar';
import AudioButton from '../../../components/AudioButton';

export default function MarketSummaryPage() {
    const { user } = useAuth();
    const { speak, autoPlayMode } = useAudio();
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummaries();
    }, []);

    useEffect(() => {
        if (autoPlayMode && summaries.length > 0) {
            const general = summaries.find(s => !s.category_id);
            if (general) speak(general.summary_text, 'fr');
        }
    }, [summaries, autoPlayMode]);

    const fetchSummaries = async () => {
        try {
            const res = await fetch('/api/market');
            const data = await res.json();
            setSummaries(data.summaries || []);
        } catch { }
        setLoading(false);
    };

    return (
        <div className="page-content">
            <header className="header-top">
                <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700 }}>📊 Suivi du Marché</h1>
                <AudioButton
                    text={summaries.length > 0
                        ? summaries.map(s => s.summary_text).join('. ')
                        : 'Aucun résumé de marché disponible.'
                    }
                    size="lg"
                />
            </header>

            <div className="container" style={{ paddingTop: 'var(--space-md)' }}>
                {/* General Summary */}
                {summaries.filter(s => !s.category_id).map(summary => (
                    <div key={summary.id} className="market-card" style={{ marginBottom: 'var(--space-xl)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
                                    📢 Résumé du jour
                                </h2>
                                <p style={{ lineHeight: 1.7, opacity: 0.9 }}>{summary.summary_text}</p>
                                <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--fs-sm)', opacity: 0.6 }}>
                                    {new Date(summary.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </div>
                            </div>
                            <AudioButton text={summary.summary_text} size="lg" className="" />
                        </div>
                    </div>
                ))}

                {/* Category Summaries */}
                <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                    Par catégorie
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {summaries.filter(s => s.category_id).map(summary => (
                        <div key={summary.id} className="card">
                            <div className="card-body" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                                <div style={{ fontSize: '36px', flexShrink: 0 }}>
                                    {summary.category_icon || '📦'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>
                                        {summary.category_name}
                                    </h3>
                                    <p style={{ color: 'var(--text-light)', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>
                                        {summary.summary_text}
                                    </p>
                                </div>
                                <AudioButton text={`${summary.category_name}. ${summary.summary_text}`} />
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
