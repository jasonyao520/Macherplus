'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('marche-token');
        if (savedToken) {
            setToken(savedToken);
            fetchUser(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (t) => {
        try {
            const res = await fetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${t}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                localStorage.removeItem('marche-token');
                setToken(null);
            }
        } catch {
            localStorage.removeItem('marche-token');
        }
        setLoading(false);
    };

    const login = useCallback(async (phone, password) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('marche-token', data.token);
        return data.user;
    }, []);

    const register = useCallback(async (userData) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('marche-token', data.token);
        return data.user;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('marche-token');
    }, []);

    const authFetch = useCallback(async (url, options = {}) => {
        const headers = { ...options.headers };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
        return fetch(url, { ...options, headers });
    }, [token]);

    return (
        <AuthCtx.Provider value={{ user, token, loading, login, register, logout, authFetch }}>
            {children}
        </AuthCtx.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
