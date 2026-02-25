'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../components/AuthContext';
import { useAudio } from '../../../../components/AudioContext';
import AudioButton from '../../../../components/AudioButton';
import NavBar from '../../../../components/NavBar';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { user, authFetch } = useAuth();
    const { speak, autoPlayMode } = useAudio();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [alternatives, setAlternatives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestSent, setRequestSent] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product && autoPlayMode) {
            const text = `${product.name}. ${product.description || ''}. Prix: ${product.price} francs CFA le ${product.unit}. Fournisseur: ${product.supplier_name}. ${product.supplier_location || ''}`;
            speak(text, 'fr');
        }
    }, [product, autoPlayMode]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            setProduct(data.product);
            setAlternatives(data.alternatives || []);
        } catch { }
        setLoading(false);
    };

    const sendRequest = async () => {
        try {
            const res = await authFetch('/api/requests', {
                method: 'POST',
                body: JSON.stringify({ product_id: id, quantity }),
            });
            if (res.ok) {
                setRequestSent(true);
                speak(`Votre demande pour ${quantity} ${product.unit} de ${product.name} a été envoyée au fournisseur.`, 'fr');
            }
        } catch { }
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="flex-center" style={{ minHeight: '60vh' }}>
                    <div className="loading-spinner"></div>
                </div>
                <NavBar role="merchant" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page-content">
                <div className="empty-state">
                    <div className="empty-state-icon">❌</div>
                    <div className="empty-state-title">Produit introuvable</div>
                    <Link href="/commercant" className="btn btn-primary" style={{ marginTop: '16px' }}>← Retour au catalogue</Link>
                </div>
                <NavBar role="merchant" />
            </div>
        );
    }

    const ttsText = `${product.name}. ${product.description || ''}. Prix: ${product.price} francs CFA le ${product.unit}. Fournisseur: ${product.supplier_name}, ${product.supplier_location || ''}`;

    return (
        <div className="page-content">
            <header className="header-top">
                <button className="btn btn-ghost btn-sm" onClick={() => router.back()}>← Retour</button>
                <AudioButton text={ttsText} size="md" />
            </header>

            <div className="container" style={{ paddingTop: 'var(--space-md)' }}>
                {/* Product Image */}
                <div style={{
                    height: '220px',
                    background: 'linear-gradient(135deg, var(--border-light), var(--border))',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '72px',
                    marginBottom: 'var(--space-lg)',
                }}>
                    {product.category_icon || '📦'}
                </div>

                {/* Product Info */}
                <div style={{ marginBottom: 'var(--space-xl)' }}>
                    <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, marginBottom: '8px' }}>
                        {product.name}
                    </h1>
                    <p style={{ color: 'var(--text-light)', marginBottom: 'var(--space-md)', lineHeight: 1.6 }}>
                        {product.description}
                    </p>
                    <div className="product-card-price" style={{ fontSize: 'var(--fs-2xl)' }}>
                        {product.price.toLocaleString('fr-FR')} <span className="unit">FCFA/{product.unit}</span>
                    </div>
                </div>

                {/* Supplier Info */}
                <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: 'var(--radius-full)',
                            background: 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '24px', fontWeight: 700, flexShrink: 0,
                        }}>
                            {product.supplier_name?.[0] || '?'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 'var(--fs-lg)' }}>{product.supplier_name}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                                {product.supplier_business} · 📍 {product.supplier_location}
                            </div>
                            {product.supplier_verified ? (
                                <span className="verified-badge">✅ Vérifié</span>
                            ) : null}
                        </div>
                        <AudioButton
                            text={`Fournisseur: ${product.supplier_name}. ${product.supplier_business}. Localisation: ${product.supplier_location}`}
                        />
                    </div>
                </div>

                {/* Quantity selector */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <label className="form-label">📦 Quantité ({product.unit})</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                        <button className="btn btn-outline btn-icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                        <span style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, minWidth: '60px', textAlign: 'center' }}>{quantity}</span>
                        <button className="btn btn-outline btn-icon" onClick={() => setQuantity(quantity + 1)}>+</button>
                        <span style={{ color: 'var(--text-muted)' }}>
                            = {(product.price * quantity).toLocaleString('fr-FR')} FCFA
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                    <button
                        className="big-action big-action-buy"
                        onClick={sendRequest}
                        disabled={requestSent}
                    >
                        <span className="big-action-icon">{requestSent ? '✅' : '🛒'}</span>
                        <span>{requestSent ? 'Envoyée!' : 'Commander'}</span>
                    </button>
                    <a
                        href={`tel:${product.supplier_phone}`}
                        className="big-action big-action-call"
                    >
                        <span className="big-action-icon">📞</span>
                        <span>Appeler</span>
                    </a>
                    <a
                        href={`https://wa.me/${product.supplier_phone?.replace(/\+/g, '')}`}
                        target="_blank"
                        rel="noopener"
                        className="big-action big-action-whatsapp"
                    >
                        <span className="big-action-icon">💬</span>
                        <span>WhatsApp</span>
                    </a>
                    <button className="big-action big-action-favorite">
                        <span className="big-action-icon">❤️</span>
                        <span>Favoris</span>
                    </button>
                </div>

                {/* Price Comparison - Alternatives from other suppliers */}
                {alternatives.length > 0 && (
                    <div style={{ marginBottom: 'var(--space-xl)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                            <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700 }}>📊 Comparer les prix</h2>
                            <AudioButton
                                text={`Comparaison de prix. ${alternatives.map(a => `${a.name} chez ${a.supplier_name}, ${a.price} francs le ${a.unit}`).join('. ')}`}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {alternatives.map((alt, i) => (
                                <Link
                                    key={alt.id}
                                    href={`/commercant/produit/${alt.id}`}
                                    className={`compare-card ${i === 0 ? 'best' : ''}`}
                                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700 }}>{alt.name}</div>
                                        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                                            {alt.supplier_name} · 📍 {alt.supplier_location}
                                        </div>
                                    </div>
                                    <div className="compare-price">
                                        {alt.price.toLocaleString('fr-FR')}
                                        <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 400 }}> FCFA/{alt.unit}</span>
                                    </div>
                                    {i === 0 && <span className="badge badge-success">Meilleur prix</span>}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <NavBar role="merchant" />
        </div>
    );
}
