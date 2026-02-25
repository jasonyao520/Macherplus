'use client';
import { useState } from 'react';
import { useAuth } from '../../../components/AuthContext';
import { useAudio } from '../../../components/AudioContext';
import { useRouter } from 'next/navigation';
import NavBar from '../../../components/NavBar';
import LanguageSelector from '../../../components/LanguageSelector';

export default function MerchantProfile() {
    const { user, logout } = useAuth();
    const { speak, language } = useAudio();
    const router = useRouter();
    const [showLang, setShowLang] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    const playHelp = () => {
        let msg = "Bienvenue, sur Marché Plus. Touchez les boutons, pour naviguer. Le bouton vocal, lit les informations sur l'écran. Votre historique, vous montrera vos anciens achats.";
        if (language === 'dioula') {
            msg = "Aw dan-na, marché pluss kan. Aw yé, fènw ta, ka ladjè. Kanto, bè kiba-rou-ya di. I ka san koro-ou, bè-na yi-ra.";
        } else if (language === 'baoule') {
            msg = "A-kwa-ba, marché pluss sou. Kpan kpan, nin-gué moun nian. A tié, nin-gué ndè. O, ato-lè, ndè, bè wa yi-yi, min o.";
        }
        speak(msg, language);
    };

    return (
        <div className="page-content">
            <header className="header-top">
                <div className="header-logo">
                    <span className="logo-icon">👤</span>
                    <span>Profil Commerçant</span>
                </div>
            </header>

            <div className="container" style={{ paddingTop: 'var(--space-xl)' }}>
                <div className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-sm)' }}>👩🏾‍🦱</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{user?.name || 'Commerçant'}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{user?.phone}</p>
                    {user?.business_name && (
                        <p style={{ fontWeight: 500, marginTop: '4px' }}>🏪 {user.business_name}</p>
                    )}
                </div>

                <div className="grid" style={{ gap: 'var(--space-sm)' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => router.push('/commercant/historique')}
                        style={{ padding: '16px', textAlign: 'left', display: 'flex', gap: '12px' }}
                    >
                        <span>📋</span> Mon historique d'achats
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowLang(!showLang)}
                        style={{ padding: '16px', textAlign: 'left', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <span>🌐</span> Préférences de langue
                        </div>
                        <span>{showLang ? '▲' : '▼'}</span>
                    </button>
                    {showLang && (
                        <div style={{ padding: '0 var(--space-md) var(--space-md) var(--space-md)' }}>
                            <LanguageSelector />
                            <p style={{ marginTop: '8px', fontSize: 'var(--fs-sm)', color: 'var(--text-light)', textAlign: 'center' }}>
                                Choisissez la langue pour la voix et les confirmations.
                            </p>
                        </div>
                    )}

                    <button
                        className="btn btn-secondary"
                        onClick={playHelp}
                        style={{ padding: '16px', textAlign: 'left', display: 'flex', gap: '12px' }}
                    >
                        <span>❓</span> Aide et tutoriels vocaux
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleLogout}
                        style={{ padding: '16px', textAlign: 'left', display: 'flex', gap: '12px', marginTop: 'var(--space-md)', background: 'var(--error)' }}
                    >
                        <span>🚪</span> Se déconnecter
                    </button>
                </div>
            </div>

            <NavBar role="merchant" />
        </div>
    );
}
