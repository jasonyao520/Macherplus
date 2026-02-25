import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { getUserFromRequest } from '../../../../lib/auth';

export async function GET(request) {
    try {
        const payload = await getUserFromRequest(request);
        if (!payload) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const db = getDb();
        const user = db.prepare(
            'SELECT id, name, phone, email, role, avatar, business_name, location, verified, created_at FROM users WHERE id = ?'
        ).get(payload.id);

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Me error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
