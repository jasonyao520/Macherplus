'use client';
import { useState, useRef, useEffect } from 'react';
import { useAudio } from './AudioContext';

export default function AudioInput({
    label,
    labelAudioText,
    labelAudioTextDioula,
    labelAudioTextBaoule,
    id,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    ...props
}) {
    const { speak, language } = useAudio();
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                // Ensure French lang for dictation
                recognition.lang = 'fr-CI'; // Or fr-FR
                recognition.continuous = false;
                recognition.interimResults = false;

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    // Trigger the onChange the same way a normal input would
                    onChange({
                        target: { name, value: transcript }
                    });
                    setIsListening(false);
                    // Confirm in the appropriate language
                    const confirmMsg = language === 'dioula' ? `Abɛ ${transcript}` : language === 'baoule' ? `Waan ${transcript}` : transcript;
                    speak(confirmMsg, language); // Repeat what was heard
                };

                recognition.onerror = () => {
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }
    }, [name, onChange, speak]);

    const handleFocus = () => {
        // ALWAYS speak on focus for accessibility, as requested by the user
        let txtToSpeak = labelAudioText;
        if (language === 'dioula' && labelAudioTextDioula) {
            txtToSpeak = labelAudioTextDioula;
        } else if (language === 'baoule' && labelAudioTextBaoule) {
            txtToSpeak = labelAudioTextBaoule;
        }

        if (txtToSpeak) {
            speak(txtToSpeak, language);
        }
    };

    const toggleListen = (e) => {
        e.preventDefault();
        // Request microphone permission and start listening
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                    setIsListening(true);
                    const promptMsg = language === 'dioula' ? 'Kuma sisan' : language === 'baoule' ? 'Kanjè lala' : 'Parlez maintenant';
                    speak(promptMsg, language);
                } catch (err) {
                    console.error('Speech recognition error:', err);
                }
            } else {
                alert("Votre navigateur ne supporte pas la dictée vocale.");
            }
        }
    };

    return (
        <div className="form-group" style={{ marginBottom: '16px' }}>
            {label && <label className="form-label" htmlFor={id}>{label} {required && '*'}</label>}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                    type={type}
                    id={id}
                    name={name}
                    className="form-input"
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    required={required}
                    style={{ paddingRight: '56px', borderColor: isListening ? 'var(--primary)' : '' }}
                    {...props}
                />
                <button
                    type="button"
                    onClick={toggleListen}
                    title="Saisie vocale"
                    style={{
                        position: 'absolute',
                        right: '8px',
                        background: isListening ? 'var(--error)' : 'var(--surface-dark)',
                        color: isListening ? 'white' : 'inherit',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        transition: 'all 0.3s'
                    }}
                >
                    {isListening ? '🛑' : '🎤'}
                </button>
            </div>
            {isListening && (
                <div style={{ fontSize: '0.85rem', color: 'var(--error)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="pulse-dot" style={{ background: 'var(--error)' }}></span>
                    Enregistrement vocal en cours...
                </div>
            )}
        </div>
    );
}
