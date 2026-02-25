'use client';
import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { translations } from '../lib/translations';

const AudioCtx = createContext(null);

export function AudioProvider({ children }) {
    const [language, setLanguage] = useState('fr');
    const [isPlaying, setIsPlaying] = useState(false);
    const [autoPlayMode, setAutoPlayMode] = useState(false);
    const [currentText, setCurrentText] = useState('');
    const audioRef = useRef(null);
    const synthRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('marche-lang');
            if (saved) setLanguage(saved);
            const autoPlay = localStorage.getItem('marche-autoplay');
            if (autoPlay === 'true') setAutoPlayMode(true);
        }
    }, []);

    const changeLang = useCallback((lang) => {
        setLanguage(lang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('marche-lang', lang);
        }
    }, []);

    const toggleAutoPlay = useCallback(() => {
        setAutoPlayMode(prev => {
            const next = !prev;
            if (typeof window !== 'undefined') {
                localStorage.setItem('marche-autoplay', String(next));
            }
            return next;
        });
    }, []);

    const stopAudio = useCallback(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setCurrentText('');
    }, []);

    const speak = useCallback((text, lang) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        stopAudio();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'fr' ? 'fr-FR' : lang === 'dioula' ? 'fr-FR' : 'fr-FR';
        utterance.rate = 0.85;
        utterance.pitch = 1;

        // Try to find a French voice
        const voices = window.speechSynthesis.getVoices();
        const frVoice = voices.find(v => v.lang.startsWith('fr'));
        if (frVoice) utterance.voice = frVoice;

        utterance.onstart = () => {
            setIsPlaying(true);
            setCurrentText(text);
        };
        utterance.onend = () => {
            setIsPlaying(false);
            setCurrentText('');
        };
        utterance.onerror = () => {
            setIsPlaying(false);
            setCurrentText('');
        };

        synthRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [stopAudio]);

    const playAudioFile = useCallback((url) => {
        stopAudio();
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        audio.play().catch(() => setIsPlaying(false));
    }, [stopAudio]);

    const t = useCallback((key) => {
        return translations[language]?.[key] || translations['fr']?.[key] || key;
    }, [language]);

    return (
        <AudioCtx.Provider value={{
            language,
            setLanguage: changeLang,
            isPlaying,
            autoPlayMode,
            toggleAutoPlay,
            speak,
            playAudioFile,
            stopAudio,
            currentText,
            t, // Provide translation function
        }}>
            {children}
        </AudioCtx.Provider>
    );
}

export function useAudio() {
    const ctx = useContext(AudioCtx);
    if (!ctx) throw new Error('useAudio must be used within AudioProvider');
    return ctx;
}
