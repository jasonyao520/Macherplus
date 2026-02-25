'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthContext';
import { useAudio } from '../../../components/AudioContext';
import AudioInput from '../../../components/AudioInput';
import LanguageSelector from '../../../components/LanguageSelector';

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { speak } = useAudio();
    const router = useRouter();

    const selectRole = (r) => {
        setRole(r);
        if (r === 'merchant') {
            speak('Vous avez choisi commerçant. Remplissez vos informations pour continuer.', 'fr');
        } else {
            speak('Vous avez choisi fournisseur. Remplissez vos informations pour continuer.', 'fr');
        }
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await register({ name, phone, password, role, business_name: businessName, location });
            speak(`Bienvenue sur Marché Plus, ${user.name}! Votre compte a été créé.`, 'fr');
            if (user.role === 'supplier') router.push('/fournisseur');
            else router.push('/commercant');
        } catch (err) {
            setError(err.message);
            speak(`Erreur: ${err.message}`, 'fr');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
                <LanguageSelector />
            </div>
            <div className="auth-container animate-fade-in-up">
                <Link href="/" className="auth-logo">
                    <span style={{ fontSize: '36px' }}>🛒</span>
                    <span className="auth-logo-text">Marché<span style={{ color: 'var(--accent)' }}>+</span></span>
                </Link>

                <h1 className="auth-title">Créer un compte ✨</h1>

                <button
                    type="button"
                    className="btn btn-ghost btn-block"
                    onClick={() => speak(
                        step === 1
                            ? 'Choisissez votre type de compte. Commerçant si vous achetez des produits, Fournisseur si vous vendez des produits.'
                            : 'Entrez votre nom, numéro de téléphone et un mot de passe pour créer votre compte.',
                        'fr'
                    )}
                    style={{ marginBottom: 'var(--space-lg)' }}
                >
                    🔊 Écouter les instructions
                </button>

                {error && (
                    <div className="auth-error">⚠️ {error}</div>
                )}

                {step === 1 ? (
                    <div>
                        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: 'var(--space-xl)', fontSize: 'var(--fs-lg)' }}>
                            Qui êtes-vous ?
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                            <button
                                className={`role-card ${role === 'merchant' ? 'selected' : ''}`}
                                onClick={() => selectRole('merchant')}
                            >
                                <div className="role-card-icon">👩🏾‍🦱</div>
                                <div className="role-card-title">Commerçant</div>
                                <div className="role-card-desc">J'achète des produits pour mon commerce</div>
                            </button>
                            <button
                                className={`role-card ${role === 'supplier' ? 'selected' : ''}`}
                                onClick={() => selectRole('supplier')}
                            >
                                <div className="role-card-icon">🚛</div>
                                <div className="role-card-title">Fournisseur</div>
                                <div className="role-card-desc">Je vends des produits alimentaires</div>
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => setStep(1)}
                            style={{ marginBottom: 'var(--space-md)' }}
                        >
                            ← Retour
                        </button>

                        <AudioInput
                            label="👤 Votre nom"
                            labelAudioText="Ici c'est pour entrer votre nom."
                            labelAudioTextDioula="I tɔgɔ bila yan"
                            labelAudioTextBaoule="Fa ɔ duman klan"
                            name="name"
                            placeholder="Ex: Aminata Koné"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <AudioInput
                            label="📱 Numéro de téléphone"
                            labelAudioText="Ici c'est pour entrer votre numéro de téléphone."
                            labelAudioTextDioula="I yɛrɛ ka numɛro bila yan"
                            labelAudioTextBaoule="Fa ɔ nymɛro klan"
                            type="tel"
                            name="phone"
                            placeholder="+225 07 00 00 00 00"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />

                        <AudioInput
                            label="🏪 Nom du commerce"
                            labelAudioText="Ici c'est pour entrer le nom de votre commerce."
                            labelAudioTextDioula="I ka bitiki tɔgɔ bila yan"
                            labelAudioTextBaoule="Fa ɔ bitiki min klan"
                            name="businessName"
                            placeholder="Ex: Marché Adjamé"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                        />

                        <AudioInput
                            label="📍 Localisation"
                            labelAudioText="Ici c'est pour entrer votre localisation ou ville."
                            labelAudioTextDioula="I dugu tɔgɔ bila yan"
                            labelAudioTextBaoule="Fa ɔ klon min klan"
                            name="location"
                            placeholder="Ex: Adjamé, Abidjan"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />

                        <AudioInput
                            label="🔒 Mot de passe"
                            labelAudioText="Ici c'est pour choisir votre mot de passe."
                            labelAudioTextDioula="I ka mot de passe bila yan"
                            labelAudioTextBaoule="Fa ɔ mot de passe klan"
                            type="password"
                            name="password"
                            placeholder="Choisissez un mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-block"
                            disabled={loading}
                        >
                            {loading ? '⏳ Création...' : '🚀 Créer mon compte'}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    <p>Déjà un compte ?</p>
                    <Link href="/auth/login" className="btn btn-outline btn-block">
                        🔐 Se connecter
                    </Link>
                </div>
            </div>

            <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-lg);
          background: linear-gradient(135deg, var(--bg) 0%, #E8F5E9 100%);
        }
        .auth-container {
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--space-2xl);
          max-width: 500px;
          width: 100%;
          box-shadow: var(--shadow-lg);
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          margin-bottom: var(--space-xl);
        }
        .auth-logo-text {
          font-size: 28px;
          font-weight: 800;
          color: var(--primary);
        }
        .auth-title {
          text-align: center;
          font-size: var(--fs-2xl);
          font-weight: 700;
          margin-bottom: var(--space-lg);
        }
        .auth-error {
          background: rgba(211, 47, 47, 0.1);
          color: var(--danger);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          margin-bottom: var(--space-lg);
          font-weight: 500;
        }
        .auth-footer {
          margin-top: var(--space-xl);
          text-align: center;
        }
        .auth-footer p {
          color: var(--text-muted);
          margin-bottom: var(--space-md);
        }
      `}</style>
        </div>
    );
}
