'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthContext';
import { useAudio } from '../../../components/AudioContext';
import NavBar from '../../../components/NavBar';
import LanguageSelector from '../../../components/LanguageSelector';
import AudioButton from '../../../components/AudioButton';

export default function SupplierProducts() {
    const { user, loading: authLoading } = useAuth();
    const { speak, autoPlayMode, toggleAutoPlay } = useAudio();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'supplier')) {
            router.push('/auth/login');
            return;
        }
        if (user) {
            fetchProducts();
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (user && autoPlayMode && !loading) {
            speak(`Vos produits. Vous avez ${products.length} produits enregistrés.`, 'fr');
        }
    }, [loading, autoPlayMode]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?supplier=${user.id}`);
            const data = await res.json();
            setProducts(data.products || []);
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
                    <span className="logo-icon">📦</span>
                    <span>Mes Produits</span>
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
                            Catalogue
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Gérez vos produits en vente</p>
                    </div>
                    <AudioButton
                        text={`Gérez votre catalogue. Vous avez ${products.length} produits. Cliquez sur Ajouter pour créer un nouveau produit.`}
                        size="lg"
                    />
                </div>

                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <Link href="/fournisseur/produits/nouveau" className="btn btn-primary" style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}>
                        <span>➕</span> Ajouter un nouveau produit
                    </Link>
                </div>

                {products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <div className="empty-state-title">Aucun produit</div>
                        <div className="empty-state-text">Commencez par ajouter votre premier produit.</div>
                    </div>
                ) : (
                    <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 'var(--space-md)' }}>
                        {products.map((product) => (
                            <div key={product.id} className="card" style={{ display: 'flex', overflow: 'hidden' }}>
                                <div style={{ width: '100px', height: '100px', flexShrink: 0, backgroundColor: 'var(--surface-dark)', position: 'relative' }}>
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div className="flex-center" style={{ width: '100%', height: '100%', fontSize: '2rem' }}>🛒</div>
                                    )}
                                </div>
                                <div className="card-body" style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{product.name}</h3>
                                    <div style={{ color: 'var(--primary)', fontWeight: 'bold', margin: '4px 0' }}>
                                        {product.price} FCFA / {product.unit}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className={`badge ${product.available ? 'badge-success' : 'badge-neutral'}`}>
                                            {product.available ? 'Disponible' : 'Épuisé'}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', gap: '8px', justifyContent: 'center', borderLeft: '1px solid var(--border-color)' }}>
                                    {/* Action buttons could go here */}
                                    <button className="btn btn-icon" title="Modifier" style={{ background: 'var(--surface-light)' }}>✏️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <NavBar role="supplier" />
        </div>
    );
}
