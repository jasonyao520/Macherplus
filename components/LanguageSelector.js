'use client';
import { useAudio } from './AudioContext';

export default function LanguageSelector() {
    const { language, setLanguage } = useAudio();

    const langs = [
        { code: 'fr', label: '🇫🇷 FR' },
        { code: 'dioula', label: 'Dioula' },
        { code: 'baoule', label: 'Baoulé' },
    ];

    return (
        <div className="lang-selector">
            {langs.map((l) => (
                <button
                    key={l.code}
                    className={`lang-option ${language === l.code ? 'active' : ''}`}
                    onClick={() => setLanguage(l.code)}
                >
                    {l.label}
                </button>
            ))}
        </div>
    );
}
