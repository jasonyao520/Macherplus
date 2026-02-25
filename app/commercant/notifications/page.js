'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/AuthContext';
import { useAudio } from '../../../components/AudioContext';
import NavBar from '../../../components/NavBar';
import AudioButton from '../../../components/AudioButton';

export default function NotificationsPage() {
    const { user, authFetch } = useAuth();
    const { speak } = useAudio();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchNotifications();
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await authFetch('/api/notifications');
            const data = await res.json();
            setNotifications(data.notifications || []);
        } catch { }
        setLoading(false);
    };

    const getNotifIcon = (type) => {
        switch (type) {
            case 'order': return { icon: '🛒', bg: 'rgba(45,125,70,0.1)' };
            case 'price': return { icon: '💰', bg: 'rgba(224,122,47,0.1)' };
            case 'info': return { icon: 'ℹ️', bg: 'rgba(25,118,210,0.1)' };
            default: return { icon: '🔔', bg: 'rgba(224,122,47,0.1)' };
        }
    };

    return (
        <div className="page-content">
            <header className="header-top">
                <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700 }}>🔔 Notifications</h1>
                <AudioButton
                    text={notifications.length > 0
                        ? `Vous avez ${notifications.length} notifications. ${notifications.slice(0, 3).map(n => n.title + '. ' + (n.message || '')).join('. ')}`
                        : 'Aucune notification pour le moment.'
                    }
                />
            </header>

            <div className="container" style={{ paddingTop: 'var(--space-md)' }}>
                {loading ? (
                    <div className="flex-center" style={{ padding: '60px 0' }}>
                        <div className="loading-spinner"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔕</div>
                        <div className="empty-state-title">Pas de notifications</div>
                        <div className="empty-state-text">Vous serez notifié des nouvelles offres et prix</div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {notifications.map((notif) => {
                            const { icon, bg } = getNotifIcon(notif.type);
                            return (
                                <div
                                    key={notif.id}
                                    className={`notification-item ${notif.read ? '' : 'unread'}`}
                                >
                                    <div className="notification-icon" style={{ background: bg }}>
                                        {icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{notif.title}</div>
                                        {notif.message && (
                                            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', marginTop: '4px' }}>
                                                {notif.message}
                                            </div>
                                        )}
                                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>
                                            {new Date(notif.created_at).toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                    <AudioButton text={`${notif.title}. ${notif.message || ''}`} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <NavBar role="merchant" />
        </div>
    );
}
