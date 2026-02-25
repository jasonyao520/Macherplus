import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { hashPassword, createToken } from '../../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        const { name, phone, password, role, business_name, location } = await request.json();

        if (!name || !phone || !password || !role) {
            return NextResponse.json(
                { error: 'Nom, téléphone, mot de passe et rôle sont requis' },
                { status: 400 }
            );
        }

        if (!['merchant', 'supplier'].includes(role)) {
            return NextResponse.json(
                { error: 'Rôle invalide' },
                { status: 400 }
            );
        }

        const db = getDb();
        const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
        if (existing) {
            return NextResponse.json(
                { error: 'Ce numéro de téléphone est déjà utilisé' },
                { status: 409 }
            );
        }

        const id = uuidv4();
        const password_hash = await hashPassword(password);

        db.prepare(
            `INSERT INTO users (id, name, phone, password_hash, role, business_name, location, verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(id, name, phone, password_hash, role, business_name || null, location || null, role === 'merchant' ? 1 : 0);

        const token = await createToken({ id, name, phone, role });

        const response = NextResponse.json({
            user: { id, name, phone, role, business_name, location },
            token,
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
