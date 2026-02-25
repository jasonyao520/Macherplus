'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import { useAudio } from '../../components/AudioContext';
import ProductCard from '../../components/ProductCard';
import NavBar from '../../components/NavBar';
import LanguageSelector from '../../components/LanguageSelector';
import AudioButton from '../../components/AudioButton';

export default function MerchantCatalog() {
    const { user, loading: authLoading, authFetch } = useAuth();
    const { speak, autoPlayMode, toggleAutoPlay, language } = useAudio();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
            return;
        }
        if (user) {
            fetchCategories();
            fetchProducts();
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (user && autoPlayMode && products.length > 0) {
            const hasWelcomed = sessionStorage.getItem(`welcomed_merchant_${user.id}`);
            if (!hasWelcomed) {
                let msg = `Bienvenue ${user.name}. Vous avez ${products.length} produits disponibles. Explorez le catalogue.`;
                if (language === 'dioula') {
                    msg = `I ni tché ${user.name}. Fènw kulu be yen. Aw y'a lajè.`; // Phonetic Dioula
                } else if (language === 'baoule') {
                    msg = `Akwaba ${user.name}. Ninnge mun dɔ man. Nian bo wun.`; // Phonetic Baoulé
                }
                speak(msg, language);
                sessionStorage.setItem(`welcomed_merchant_${user.id}`, 'true');
            }
        }
    }, [products.length, autoPlayMode, user, language, speak]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch { }
    };

    const fetchProducts = async (categoryId = null, searchTerm = '') => {
        setLoading(true);
        try {
            let url = '/api/products?limit=50';
            if (categoryId) url += `&category=${categoryId}`;
            if (searchTerm) url += `&search=${searchTerm}`;
            const res = await fetch(url);
            const data = await res.json();
            setProducts(data.products || []);
        } catch { }
        setLoading(false);
    };

    const handleCategoryClick = (catId) => {
        const newCat = selectedCategory === catId ? null : catId;
        setSelectedCategory(newCat);
        fetchProducts(newCat, search);
        if (newCat) {
            const cat = categories.find(c => c.id === catId);
            if (cat) speak(cat.audio_label_fr || cat.name, 'fr');
        }
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        if (val.length >= 2 || val.length === 0) {
            fetchProducts(selectedCategory, val);
        }
    };

    if (authLoading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="page-content">
            {/* Header */}
            <header className="header-top">
                <div className="header-logo">
                    <span className="logo-icon">🛒</span>
                    <span>Marché<span style={{ color: 'var(--accent)' }}>+</span></span>
                </div>
                <div className="header-actions">
                    <LanguageSelector />
                    <button
                        className={`btn btn-icon ${autoPlayMode ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={toggleAutoPlay}
                        title={autoPlayMode ? 'Mode audio activé' : 'Activer le mode audio'}
                    >
                        {autoPlayMode ? '🔊' : '🔇'}
                    </button>
                </div>
            </header>

            <div className="container" style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-lg)' }}>
                {/* Welcome */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>
                            Bonjour {user?.name?.split(' ')[0]} 👋
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Trouvez les meilleurs produits aujourd'hui</p>
                    </div>
                    <AudioButton
                        text={`Bonjour ${user?.name}. Bienvenue sur Marché Plus. Vous pouvez parcourir les produits, écouter les prix, et contacter les fournisseurs.`}
                        size="lg"
                    />
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', marginBottom: 'var(--space-lg)' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>🔍</span>
                    <input
                        type="search"
                        className="form-input"
                        placeholder="Rechercher un produit..."
                        value={search}
                        onChange={handleSearch}
                        style={{ paddingLeft: '48px' }}
                    />
                </div>

                {/* Categories */}
                <div className="categories-scroll" style={{ marginBottom: 'var(--space-lg)' }}>
                    <button
                        className={`category-pill ${!selectedCategory ? 'active' : ''}`}
                        onClick={() => { setSelectedCategory(null); fetchProducts(null, search); }}
                    >
                        <span className="icon">🏪</span> Tout
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(cat.id)}
                        >
                            <span className="icon">{cat.icon}</span> {cat.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="products-grid">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="card">
                                <div className="skeleton" style={{ height: '160px' }}></div>
                                <div className="card-body">
                                    <div className="skeleton" style={{ height: '20px', marginBottom: '8px' }}></div>
                                    <div className="skeleton" style={{ height: '14px', width: '60%' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <div className="empty-state-title">Aucun produit trouvé</div>
                        <div className="empty-state-text">Essayez une autre catégorie ou recherche</div>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            <NavBar role="merchant" />
        </div>
    );
}
