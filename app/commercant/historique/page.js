'use client';
import { useAuth } from '../../../components/AuthContext';
import { useAudio } from '../../../components/AudioContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavBar from '../../../components/NavBar';

export default function PurchaseHistory() {
    const { user } = useAuth();
    const { speak, language } = useAudio();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching history
        setTimeout(() => setLoading(false), 500);
    }, []);

    const playAudioEmpty = () => {
        let msg = "Votre historique d'achats, est vide. Vous n'avez pas encore, passé de commande.";
        if (language === 'dioula') {
            msg = "I ka san koro-ou, tè yène. I ma fèn san foc-lo.";
        } else if (language === 'baoule') {
            msg = "O, ato-lè, ndè, bè-wa min. A to-man, nin-gué ka.";
        }
        speak(msg, language);
    };

    return (
        <div className="page-content">
            <header className="header-top">
                <button
                    onClick={() => router.back()}
                    className="btn btn-ghost"
                    style={{ padding: '8px', marginRight: '8px' }}
                >
                    ←
                </button>
                <div className="header-logo">
                    <span className="logo-icon">📋</span>
                    <span>Historique d'achats</span>
                </div>
            </header>

            <div className="container" style={{ paddingTop: 'var(--space-xl)', textAlign: 'center' }}>
                <button
                    className="btn btn-ghost"
                    onClick={playAudioEmpty}
                    style={{ marginBottom: 'var(--space-lg)', width: '100%', padding: '16px' }}
                >
                    🔊 Écouter
                </button>

                {loading ? (
                    <div style={{ padding: 'var(--space-xl)', color: 'var(--text-light)' }}>
                        Chargement...
                    </div>
                ) : (
                    <div className="card" style={{ padding: 'var(--space-2xl)', marginTop: 'var(--space-xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)', opacity: 0.5 }}>🤷🏾‍♀️</div>
                        <h3 style={{ marginBottom: 'var(--space-sm)' }}>Aucun achat récent</h3>
                        <p style={{ color: 'var(--text-light)' }}>
                            Vous n'avez pas encore effectué de demande d'achat sur la plateforme.
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() => router.push('/commercant')}
                            style={{ marginTop: 'var(--space-xl)' }}
                        >
                            🛒 Explorer le catalogue
                        </button>
                    </div>
                )}
            </div>

            <NavBar role="merchant" />
        </div >
    );
}
