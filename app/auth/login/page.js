'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthContext';
import { useAudio } from '../../../components/AudioContext';
import AudioInput from '../../../components/AudioInput';
import LanguageSelector from '../../../components/LanguageSelector';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { speak } = useAudio();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(phone, password);
      speak(`Bienvenue ${user.name}!`, 'fr');
      if (user.role === 'admin') router.push('/admin');
      else if (user.role === 'supplier') router.push('/fournisseur');
      else router.push('/commercant');
    } catch (err) {
      setError(err.message);
      speak('Connexion échouée. Vérifiez votre numéro et mot de passe.', 'fr');
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

        <h1 className="auth-title">Connexion 🔐</h1>

        <button
          type="button"
          className="btn btn-ghost btn-block"
          onClick={() => speak('Entrez votre numéro de téléphone et votre mot de passe pour vous connecter.', 'fr')}
          style={{ marginBottom: 'var(--space-lg)' }}
        >
          🔊 Écouter les instructions
        </button>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            label="🔒 Mot de passe"
            labelAudioText="Ici c'est pour entrer votre mot de passe."
            labelAudioTextDioula="I ka mot de passe bila yan"
            labelAudioTextBaoule="Fa ɔ mot de passe klan"
            type="password"
            name="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={loading}
          >
            {loading ? '⏳ Connexion...' : '🚀 Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Pas encore de compte ?</p>
          <Link href="/auth/register" className="btn btn-outline btn-block">
            ✨ Créer un compte
          </Link>
        </div>

        <div className="auth-demo-info">
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>🧪 Comptes démo :</p>
          <p>📱 +2250701000001 (commerçant)</p>
          <p>📱 +2250701000003 (fournisseur)</p>
          <p>📱 +2250700000000 (admin)</p>
          <p>🔒 Mot de passe : password123</p>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-lg);
          background: linear-gradient(135deg, var(--bg) 0%, #FFF0E0 100%);
        }
        .auth-container {
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--space-2xl);
          max-width: 440px;
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
        .auth-demo-info {
          margin-top: var(--space-xl);
          padding: var(--space-md);
          background: var(--bg);
          border-radius: var(--radius-md);
          font-size: var(--fs-sm);
          color: var(--text-light);
        }
      `}</style>
    </div>
  );
}
