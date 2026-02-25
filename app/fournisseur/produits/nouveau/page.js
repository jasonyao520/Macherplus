'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../components/AuthContext';
import { useAudio } from '../../../../components/AudioContext';
import LanguageSelector from '../../../../components/LanguageSelector';
import AudioButton from '../../../../components/AudioButton';
import AudioInput from '../../../../components/AudioInput';

export default function NewProduct() {
    const { user, loading: authLoading } = useAuth();
    const { speak, autoPlayMode, toggleAutoPlay } = useAudio();
    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        unit: 'kg',
        description: '',
        image: '' // In MVP, this might just be a URL or emoji placeholder. 
    });

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'supplier')) {
            router.push('/auth/login');
            return;
        }
        fetchCategories();
    }, [user, authLoading]);

    useEffect(() => {
        if (autoPlayMode && categories.length > 0) {
            speak('Ajoutez un nouveau produit. Remplissez le nom, le prix et choisissez une catégorie.', 'fr');
        }
    }, [categories.length, autoPlayMode]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (e) {
            console.error(e);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price)
                })
            });

            if (res.ok) {
                if (autoPlayMode) speak('Produit ajouté avec succès.', 'fr');
                router.push('/fournisseur/produits');
            } else {
                const data = await res.json();
                setError(data.error || 'Erreur lors de l\'ajout.');
                if (autoPlayMode) speak('Erreur lors de l\'ajout.', 'fr');
            }
        } catch (e) {
            setError('Erreur de connexion.');
        }

        setLoading(false);
    };

    if (authLoading) return <div className="flex-center" style={{ minHeight: '100vh' }}><div className="loading-spinner"></div></div>;

    return (
        <div className="page-content" style={{ paddingBottom: 'var(--space-xl)' }}>
            <header className="header-top">
                <div className="header-logo">
                    <Link href="/fournisseur/produits" className="btn btn-ghost" style={{ padding: '8px' }}>
                        ⬅️
                    </Link>
                    <span>Ajouter Produit</span>
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

            <div className="container" style={{ paddingTop: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>
                            Nouveau Produit
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Mettez en vente un nouvel article</p>
                    </div>
                    <AudioButton
                        text={`Formulaire d'ajout. Veuillez entrer le nom, le prix en francs CFA, et choisir une catégorie de nourriture.`}
                        size="lg"
                    />
                </div>

                {error && <div className="error-message" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <AudioInput
                        id="name"
                        label="Nom du produit"
                        labelAudioText="Ici c'est pour le nom du produit."
                        labelAudioTextDioula="Fèn tɔgɔ bila yan"
                        labelAudioTextBaoule="Fa ninnge min klan"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex: Tomates fraîches"
                        required
                    />

                    <div className="form-group">
                        <label className="form-label" htmlFor="category_id">Catégorie *</label>
                        <select
                            id="category_id"
                            name="category_id"
                            className="form-input"
                            value={formData.category_id}
                            onChange={handleChange}
                            onFocus={() => { if (autoPlayMode) speak("Ici c'est pour choisir la catégorie", 'fr') }}
                            required
                            style={{ padding: '16px', background: 'var(--surface-light)' }}
                        >
                            <option value="">Sélectionnez une catégorie...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                        <AudioInput
                            id="price"
                            label="Prix (FCFA)"
                            labelAudioText="Ici c'est pour le prix en francs CFA."
                            labelAudioTextDioula="Wari bila yan"
                            labelAudioTextBaoule="Fa sika nuan klan"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Ex: 500"
                            required
                            min="0"
                        />
                        <div className="form-group">
                            <label className="form-label" htmlFor="unit">Unité *</label>
                            <select
                                id="unit"
                                name="unit"
                                className="form-input"
                                value={formData.unit}
                                onChange={handleChange}
                                onFocus={() => { if (autoPlayMode) speak("Ici c'est pour choisir l'unité", 'fr') }}
                                required
                                style={{ padding: '16px', background: 'var(--surface-light)' }}
                            >
                                <option value="kg">Kilo (kg)</option>
                                <option value="tas">Le tas</option>
                                <option value="carton">Carton</option>
                                <option value="sac">Sac</option>
                                <option value="piece">Pièce</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Description (Optionnelle)</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-input"
                            value={formData.description}
                            onChange={handleChange}
                            onFocus={() => { speak("Ici c'est pour la description du produit", 'fr') }}
                            placeholder="Détails supplémentaires sur la qualité, la provenance..."
                            style={{ minHeight: '100px', resize: 'vertical' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                        <label className="form-label">Photo du produit</label>
                        <div className="flex-center" style={{ border: '2px dashed var(--border-color)', padding: 'var(--space-xl)', borderRadius: '12px', background: 'var(--surface-light)', color: 'var(--text-muted)' }}>
                            📷 Cliquez pour ajouter une photo<br />
                            <small>(Version MVP: photo non requise)</small>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '16px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {loading ? 'Enregistrement...' : '✅ Publier le produit'}
                    </button>
                </form>
            </div>
        </div>
    );
}
