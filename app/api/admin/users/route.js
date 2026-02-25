import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { getUserFromRequest } from '../../../../lib/auth';

export async function GET(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const db = getDb();
        const users = db.prepare('SELECT id, name, phone, email, role, business_name, location, verified, created_at FROM users ORDER BY created_at DESC').all();

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Admin users error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
