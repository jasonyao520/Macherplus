'use client';
import { useAudio } from './AudioContext';

export default function AudioButton({ text, audioUrl, size = 'md', className = '' }) {
    const { speak, playAudioFile, stopAudio, isPlaying, language } = useAudio();

    const handleClick = (e) => {
        e.stopPropagation();
        if (isPlaying) {
            stopAudio();
        } else if (audioUrl) {
            playAudioFile(audioUrl);
        } else if (text) {
            speak(text, language);
        }
    };

    const sizeClass = size === 'lg' ? 'audio-btn-lg' : '';

    return (
        <button
            className={`audio-btn ${sizeClass} ${isPlaying ? 'playing' : ''} ${className}`}
            onClick={handleClick}
            aria-label={isPlaying ? 'Arrêter la lecture' : 'Écouter'}
            title={isPlaying ? 'Arrêter' : 'Écouter'}
        >
            {isPlaying ? '⏹️' : '🔊'}
        </button>
    );
}
