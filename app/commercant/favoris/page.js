'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/AuthContext';
import { useAudio } from '../../../components/AudioContext';
import NavBar from '../../../components/NavBar';
import AudioButton from '../../../components/AudioButton';

export default function FavorisPage() {
    const { user, authFetch } = useAuth();
    const { speak } = useAudio();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchFavorites();
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const res = await authFetch('/api/favorites');
            const data = await res.json();
            setFavorites(data.favorites || []);
        } catch { }
        setLoading(false);
    };

    return (
        <div className="page-content">
            <header className="header-top">
                <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700 }}>❤️ Mes Favoris</h1>
                <AudioButton text={`Vous avez ${favorites.length} produits en favoris.`} />
            </header>

            <div className="container" style={{ paddingTop: 'var(--space-md)' }}>
                {loading ? (
                    <div className="flex-center" style={{ padding: '60px 0' }}>
                        <div className="loading-spinner"></div>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">💝</div>
                        <div className="empty-state-title">Pas encore de favoris</div>
                        <div className="empty-state-text">Ajoutez des produits en favoris depuis le catalogue</div>
                    </div>
                ) : (
                    <div className="products-grid">
                        {favorites.map((fav) => (
                            <a key={fav.favorite_id} href={`/commercant/produit/${fav.id}`} className="card product-card">
                                <div className="product-card-image">
                                    <span>{fav.category_icon || '📦'}</span>
                                </div>
                                <div className="card-body">
                                    <div className="product-card-name">{fav.name}</div>
                                    <div className="product-card-supplier">📍 {fav.supplier_name}</div>
                                    <div className="product-card-price">
                                        {fav.price?.toLocaleString('fr-FR')} <span className="unit">FCFA/{fav.unit}</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>

            <NavBar role="merchant" />
        </div>
    );
}
