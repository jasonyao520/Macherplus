'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthContext';
import { useAudio } from '../../../components/AudioContext';
import NavBar from '../../../components/NavBar';
import LanguageSelector from '../../../components/LanguageSelector';
import AudioButton from '../../../components/AudioButton';

export default function SupplierRequests() {
    const { user, loading: authLoading } = useAuth();
    const { speak, autoPlayMode, toggleAutoPlay } = useAudio();
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'supplier')) {
            router.push('/auth/login');
            return;
        }
        if (user) {
            fetchRequests();
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (user && autoPlayMode && !loading) {
            const pending = requests.filter(r => r.status === 'pending').length;
            speak(`Vos demandes. Vous avez ${pending} demandes en attente de réponse.`, 'fr');
        }
    }, [loading, autoPlayMode]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/requests?supplier=${user.id}`);
            const data = await res.json();
            setRequests(data.requests || []);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const updateRequestStatus = async (id, newStatus) => {
        try {
            // Update UI optimistically
            setRequests(requests.map(req =>
                req.id === id ? { ...req, status: newStatus } : req
            ));

            const res = await fetch(`/api/requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) {
                // Revert on error
                fetchRequests();
            } else if (autoPlayMode) {
                speak(`Demande ${newStatus === 'accepted' ? 'acceptée' : 'refusée'} avec succès.`, 'fr');
            }
        } catch (e) {
            console.error(e);
            fetchRequests();
        }
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
                    <span className="logo-icon">📋</span>
                    <span>Demandes</span>
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
                            Commandes
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Gérez les demandes des commerçants</p>
                    </div>
                    <AudioButton
                        text={`Gérez vos commandes. Vous avez ${requests.filter(r => r.status === 'pending').length} demandes en attente.`}
                        size="lg"
                    />
                </div>

                {requests.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <div className="empty-state-title">Aucune demande</div>
                        <div className="empty-state-text">Vous n'avez pas encore reçu de demandes.</div>
                    </div>
                ) : (
                    <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 'var(--space-md)' }}>
                        {requests.map((req) => (
                            <div key={req.id} className="card" style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{req.product_name || 'Produit'}</h3>
                                        <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem', margin: '4px 0' }}>
                                            {req.quantity} {req.unit || 'kg'}
                                        </div>
                                    </div>
                                    <span className={`badge ${req.status === 'pending' ? 'badge-warning' : req.status === 'accepted' ? 'badge-success' : req.status === 'rejected' ? 'badge-danger' : 'badge-neutral'}`}>
                                        {req.status === 'pending' ? 'En attente' : req.status === 'accepted' ? 'Accepté' : req.status === 'rejected' ? 'Refusé' : req.status}
                                    </span>
                                </div>

                                <div style={{ background: 'var(--surface-light)', padding: '12px', borderRadius: '8px', marginTop: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '1.2rem' }}>👤</span>
                                        <span style={{ fontWeight: 'bold' }}>{req.merchant_name || 'Commerçant inconnu'}</span>
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
                                        Reçu le {new Date(req.created_at).toLocaleDateString()}
                                    </div>
                                    {req.message && (
                                        <div style={{ padding: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', fontStyle: 'italic', fontSize: '0.95rem' }}>
                                            "{req.message}"
                                        </div>
                                    )}
                                </div>

                                {req.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: '8px' }}>
                                        <button
                                            className="btn btn-primary"
                                            style={{ flex: 1, padding: '12px' }}
                                            onClick={() => updateRequestStatus(req.id, 'accepted')}
                                        >
                                            ✅ Accepter
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ flex: 1, padding: '12px' }}
                                            onClick={() => updateRequestStatus(req.id, 'rejected')}
                                        >
                                            ❌ Refuser
                                        </button>
                                    </div>
                                )}

                                {req.status === 'accepted' && (
                                    <div style={{ marginTop: '8px', textAlign: 'center' }}>
                                        <a
                                            href={`tel:${req.merchant_phone || ''}`}
                                            className="btn"
                                            style={{ display: 'block', background: 'var(--green)', color: 'white', padding: '12px', borderRadius: '50px', textDecoration: 'none' }}
                                        >
                                            📞 Appeler le commerçant
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <NavBar role="supplier" />
        </div>
    );
}
