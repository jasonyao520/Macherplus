'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/AuthContext';
import NavBar from '../../../../components/NavBar';
import Link from 'next/link';

export default function NewProduct() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        unit: 'kg',
        category_id: ''
    });

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'supplier')) {
            router.push('/auth/login');
        }
        fetchCategories();
    }, [user, authLoading, router]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Erreur lors de la création');
            } else {
                setSuccess('Produit ajouté avec succès !');
                setTimeout(() => router.push('/fournisseur/produits'), 1500);
            }
        } catch (err) {
            setError('Erreur de connexion');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading) return <div className="flex-center" style={{ minHeight: '100vh' }}><div className="loading-spinner"></div></div>;

    return (
        <div className="page-content">
            <header className="header-top">
                <div className="header-logo">
                    <span className="logo-icon">➕</span>
                    <span>Nouveau Produit</span>
                </div>
            </header>

            <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'calc(80px + var(--space-lg))' }}>
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-lg)' }}>
                    {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-md)', padding: '12px', background: 'rgba(211,47,47,0.1)', color: 'var(--danger)', borderRadius: '8px' }}>{error}</div>}
                    {success && <div className="alert alert-success" style={{ marginBottom: 'var(--space-md)', padding: '12px', background: 'rgba(45,125,70,0.1)', color: 'var(--success)', borderRadius: '8px' }}>{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Catégorie *</label>
                            <select
                                name="category_id"
                                className="form-input"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Choisir une catégorie</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nom du produit *</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="Ex: Banane douce, Tomate cerise..."
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Prix (FCFA) *</label>
                            <input
                                type="number"
                                name="price"
                                className="form-input"
                                placeholder="Ex: 500"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Unité de vente *</label>
                            <select
                                name="unit"
                                className="form-input"
                                value={formData.unit}
                                onChange={handleChange}
                                required
                            >
                                <option value="kg">Le Kilo (kg)</option>
                                <option value="pièce">À la pièce</option>
                                <option value="tas">Le Tas</option>
                                <option value="sac">Le Sac</option>
                                <option value="caisse">La Caisse</option>
                                <option value="bouteille">La Bouteille (1L)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description (Optionnel)</label>
                            <textarea
                                name="description"
                                className="form-input"
                                placeholder="Détails supplémentaires..."
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                            <Link href="/fournisseur/produits" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
                                Annuler
                            </Link>
                            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={submitting}>
                                {submitting ? 'Enregistrement...' : 'Enregistrer le produit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <NavBar role="supplier" />
        </div>
    );
}
